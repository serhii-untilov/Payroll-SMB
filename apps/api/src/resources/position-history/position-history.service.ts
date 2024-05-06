import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType, castAsPositionHistory } from '@repo/shared';
import { FindOptionsWhere, Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistory } from './entities/position-history.entity';
import { FindPositionHistoryDto } from './dto/find-position-history.dto';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { add, sub } from 'date-fns';

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
    ) {}

    async create(userId: number, payload: CreatePositionHistoryDto): Promise<PositionHistory> {
        const position = await this.positionsService.findOne(userId, payload.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.CREATE,
        );
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        await this.normalizeAfterCreateOrUpdate(userId, created);
        return created;
    }

    async findAll(
        userId: number,
        positionId: number,
        relations: boolean = false,
    ): Promise<PositionHistory[]> {
        const position = await this.positionsService.findOne(userId, positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
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

    async findOne(
        userId: number,
        id: number,
        relations: boolean = false,
    ): Promise<PositionHistory> {
        const record = await this.repository.findOne({
            where: { id },
            relations: {
                position: relations,
                department: relations,
                job: relations,
                workNorm: relations,
                paymentType: relations,
            },
        });
        if (!record) {
            throw new NotFoundException(`PositionHistory could not be found.`);
        }
        const position = await this.positionsService.findOne(userId, record.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return record;
    }

    async update(
        userId: number,
        id: number,
        payload: UpdatePositionHistoryDto,
    ): Promise<PositionHistory> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, record.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.UPDATE,
        );
        const updated = await this.repository.save({ ...payload, id, updatedUserId: userId });
        await this.normalizeAfterCreateOrUpdate(userId, updated);
        return updated;
    }

    async remove(userId: number, id: number): Promise<PositionHistory> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        const position = await this.positionsService.findOne(userId, record.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.DELETE,
        );
        const deleted = await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
        await this.normalizeAfterDeleted(userId, deleted);
        return deleted;
    }

    async find(userId: number, params: FindPositionHistoryDto): Promise<PositionHistory[]> {
        const position = await this.positionsService.findOne(userId, params.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
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

    async normalizeAfterCreateOrUpdate(userId: number, record: PositionHistory): Promise<void> {
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

    async normalizeAfterDeleted(userId: number, record: PositionHistory): Promise<void> {
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
