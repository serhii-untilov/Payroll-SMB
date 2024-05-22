import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType, castAsPositionHistory } from '@repo/shared';
import { add, sub } from 'date-fns';
import { FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { FindPositionHistoryDto } from './dto/find-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistory } from './entities/position-history.entity';
import { PositionUpdatedEvent } from '../positions/events/position-updated.event';

@Injectable()
export class PositionHistoryService {
    public readonly resourceType = ResourceType.POSITION;

    constructor(
        @InjectRepository(PositionHistory)
        private repository: Repository<PositionHistory>,
        @Inject(forwardRef(() => PositionsService))
        private readonly positionsService: PositionsService,
        @Inject(forwardRef(() => PayPeriodsService))
        private readonly payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
        private eventEmitter: EventEmitter2,
    ) {}

    async availableFindAllOrFail(userId: number, positionId: number) {
        const position = await this.positionsService.findOne(userId, positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableFindOneOrFail(userId: number, positionId: number) {
        const position = await this.positionsService.findOne(userId, positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableCreateOrFail(userId: number, positionId: number) {
        const position = await this.positionsService.findOne(userId, positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.CREATE,
        );
    }

    async availableUpdateOrFail(userId: number, id: number) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, record.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.UPDATE,
        );
    }

    async availableDeleteOrFail(userId: number, id: number) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, record.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.DELETE,
        );
    }

    async create(userId: number, payload: CreatePositionHistoryDto): Promise<PositionHistory> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        await this.normalizeAfterCreateOrUpdate(userId, created);
        const record = await this.repository.findOneOrFail({ where: { id: created.id } });
        const position = await this.positionsService.findOne(userId, record.positionId);
        this.eventEmitter.emit('position.updated', new PositionUpdatedEvent(userId, position));
        return record;
    }

    async findAll(
        userId: number,
        positionId: number,
        relations: boolean = false,
    ): Promise<PositionHistory[]> {
        return await this.repository.find({
            where: {
                positionId,
            },
            relations: {
                position: relations,
                department: relations,
                job: relations,
                workNorm: relations,
                paymentType: relations,
            },
        });
    }

    async findOne(id: number, relations: boolean = false): Promise<PositionHistory> {
        return await this.repository.findOneOrFail({
            where: { id },
            relations: {
                position: relations,
                department: relations,
                job: relations,
                workNorm: relations,
                paymentType: relations,
            },
        });
    }

    async update(
        userId: number,
        id: number,
        payload: UpdatePositionHistoryDto,
    ): Promise<PositionHistory> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        const updated = await this.repository.save({ ...payload, id, updatedUserId: userId });
        await this.normalizeAfterCreateOrUpdate(userId, updated);
        const position = await this.positionsService.findOne(userId, record.positionId);
        this.eventEmitter.emit('position.updated', new PositionUpdatedEvent(userId, position));
        return record;
    }

    async remove(userId: number, id: number): Promise<PositionHistory> {
        const deleted = await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
        await this.normalizeAfterDeleted(userId, deleted);
        const record = await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
        const position = await this.positionsService.findOne(userId, record.positionId);
        this.eventEmitter.emit('position.updated', new PositionUpdatedEvent(userId, position));
        return record;
    }

    async find(userId: number, params: FindPositionHistoryDto): Promise<PositionHistory[]> {
        const position = await this.positionsService.findOne(userId, params.positionId);
        const where: FindOptionsWhere<PositionHistory> = castAsPositionHistory(params);
        if (params.onDate) {
            where.dateFrom = LessThanOrEqual(params.onDate);
            where.dateTo = MoreThanOrEqual(params.onDate);
        }
        if (params.onPayPeriodDate) {
            const payPeriod = await this.payPeriodsService.findOne(userId, {
                where: {
                    companyId: position.companyId,
                    dateFrom: params.onPayPeriodDate,
                },
            });
            where.dateFrom = LessThanOrEqual(payPeriod.dateTo);
            where.dateTo = MoreThanOrEqual(payPeriod.dateFrom);
        }
        return this.repository.find({
            where,
            relations: {
                position: !!params.relations,
                department: !!params.relations,
                job: !!params.relations,
                workNorm: !!params.relations,
                paymentType: !!params.relations,
            },
        });
    }

    private async normalizeAfterCreateOrUpdate(
        userId: number,
        record: PositionHistory,
    ): Promise<void> {
        const position = await this.positionsService.findOne(userId, record.positionId);
        if (!position) {
            throw new NotFoundException('Position not found.');
        }
        const list = (
            await this.repository.find({ where: { positionId: record.positionId } })
        ).sort((a, b) => (a.dateFrom < b.dateFrom ? -1 : a.dateFrom > b.dateFrom ? 1 : 0));
        // Delete out of position's period
        for (const id of list
            .filter((o) => o.id !== record.id)
            .filter((o) => o.dateFrom > position.dateTo || o.dateTo < position.dateFrom)
            .map((o) => o.id)) {
            await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        }
        // Delete in record period
        for (const id of list
            .filter((o) => o.id !== record.id)
            .filter((o) => o.dateFrom >= record.dateFrom && o.dateTo <= record.dateTo)
            .map((o) => o.id)) {
            await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        }
        // Shift dateTo
        for (const id of list
            .filter((o) => o.id !== record.id)
            .filter((o) => o.dateFrom < record.dateFrom && o.dateTo >= record.dateFrom)
            .map((o) => o.id)) {
            const dateTo = sub(record.dateFrom, { days: -1 });
            await this.repository.save({ id, dateTo, updatedUserId: userId });
        }
        // Shift dateFrom
        for (const id of list
            .filter((o) => o.id !== record.id)
            .filter((o) => o.dateFrom <= record.dateTo && o.dateTo > record.dateTo)
            .map((o) => o.id)) {
            const dateFrom = add(record.dateTo, { days: 1 });
            await this.repository.save({ id, dateFrom, updatedUserId: userId });
        }
    }

    private async normalizeAfterDeleted(userId: number, record: PositionHistory): Promise<void> {
        const position = await this.positionsService.findOne(userId, record.positionId);
        if (!position) {
            throw new NotFoundException('Position not found.');
        }
        const list = (
            await this.repository.find({ where: { positionId: record.positionId } })
        ).sort((a, b) => (a.dateFrom < b.dateFrom ? -1 : a.dateFrom > b.dateFrom ? 1 : 0));
        // Delete out of position's period
        for (const id of list
            .filter((o) => o.id !== record.id)
            .filter((o) => o.dateFrom > position.dateTo || o.dateTo < position.dateFrom)
            .map((o) => o.id)) {
            await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        }
        // Shift dateTo
        const dateTo = sub(record.dateFrom, { days: -1 });
        for (const id of list
            .filter((o) => o.id !== record.id)
            .filter((o) => o.dateFrom < record.dateFrom && o.dateTo === dateTo)
            .map((o) => o.id)) {
            await this.repository.save({ id, dateTo: record.dateTo, updatedUserId: userId });
        }
        // Shift dateFrom
        const dateFrom = add(record.dateTo, { days: 1 });
        for (const id of list
            .filter((o) => o.id !== record.id)
            .filter((o) => o.dateFrom === dateFrom && o.dateTo > record.dateTo)
            .map((o) => o.id)) {
            await this.repository.save({ id, dateFrom: record.dateFrom, updatedUserId: userId });
        }
    }
}
