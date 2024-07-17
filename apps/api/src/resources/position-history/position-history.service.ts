import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType } from '@repo/shared';
import { add, sub } from 'date-fns';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { PositionUpdatedEvent } from '../positions/events/position-updated.event';
import { PositionsService } from '../positions/positions.service';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { FindAllPositionHistoryDto } from './dto/find-all-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistory } from './entities/position-history.entity';
import { FindOnePositionHistoryDto } from './dto/find-one-position-history.dto';

@Injectable()
export class PositionHistoryService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.POSITION;

    constructor(
        @InjectRepository(PositionHistory)
        private repository: Repository<PositionHistory>,
        @Inject(forwardRef(() => PositionsService))
        private readonly positionsService: PositionsService,
        @Inject(forwardRef(() => PayPeriodsService))
        private readonly payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        private eventEmitter: EventEmitter2,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        const { positionId } = await this.repository.findOneOrFail({
            select: { positionId: true },
            where: { id: entityId },
        });
        return (await this.positionsService.findOne(positionId)).companyId;
    }

    async getPositionCompanyId(positionId: number): Promise<number> {
        return (await this.positionsService.findOne(positionId)).companyId;
    }

    async create(userId: number, payload: CreatePositionHistoryDto): Promise<PositionHistory> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        await this.normalizeAfterCreateOrUpdate(userId, created);
        const record = await this.repository.findOneOrFail({ where: { id: created.id } });
        const position = await this.positionsService.findOne(record.positionId);
        this.eventEmitter.emit('position.updated', new PositionUpdatedEvent(userId, position));
        return record;
    }

    async findAll(params: FindAllPositionHistoryDto): Promise<PositionHistory[]> {
        const position = params.onPayPeriodDate
            ? await this.positionsService.findOne(params.positionId)
            : null;
        const payPeriod =
            params.onPayPeriodDate && position
                ? await this.payPeriodsService.findOneBy({
                      where: { companyId: position.companyId, dateFrom: params.onPayPeriodDate },
                  })
                : null;
        const response = await this.repository.find({
            where: {
                positionId: params.positionId,
                ...(params.onDate ? { dateFrom: LessThanOrEqual(params.onDate) } : {}),
                ...(params.onDate ? { dateTo: MoreThanOrEqual(params.onDate) } : {}),
                ...(params.onPayPeriodDate && payPeriod
                    ? { dateFrom: LessThanOrEqual(payPeriod.dateTo) }
                    : {}),
                ...(params.onPayPeriodDate && payPeriod
                    ? { dateTo: MoreThanOrEqual(payPeriod.dateFrom) }
                    : {}),
            },
            relations: {
                position: !!params.relations,
                department: !!params.relations,
                job: !!params.relations,
                workNorm: !!params.relations,
                paymentType: !!params.relations,
            },
        });
        if (!!params.last && response.length > 1) {
            response.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
            return [response[response.length - 1]];
        }
        return response;
    }

    async findOne(id: number, params?: FindOnePositionHistoryDto): Promise<PositionHistory> {
        return await this.repository.findOneOrFail({
            where: { id },
            relations: {
                position: !!params?.relations,
                department: !!params?.relations,
                job: !!params?.relations,
                workNorm: !!params?.relations,
                paymentType: !!params?.relations,
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
        const updated = await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        await this.normalizeAfterCreateOrUpdate(userId, updated);
        const position = await this.positionsService.findOne(record.positionId);
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
        const position = await this.positionsService.findOne(record.positionId);
        this.eventEmitter.emit('position.updated', new PositionUpdatedEvent(userId, position));
        return record;
    }

    private async normalizeAfterCreateOrUpdate(
        userId: number,
        record: PositionHistory,
    ): Promise<void> {
        const position = await this.positionsService.findOne(record.positionId);
        if (!position) {
            throw new NotFoundException('Position not found.');
        }
        const list = (
            await this.repository.find({ where: { positionId: record.positionId } })
        ).sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
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
            await this.repository.save({
                id,
                dateTo,
                updatedUserId: userId,
            });
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
        const position = await this.positionsService.findOne(record.positionId);
        if (!position) {
            throw new NotFoundException('Position not found.');
        }
        const list = (
            await this.repository.find({ where: { positionId: record.positionId } })
        ).sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
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
