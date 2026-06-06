import { Action, Resource } from '@/types';
import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { add, sub } from 'date-fns';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base';
import { PayPeriodService } from '../pay-period/pay-period.service';
import { PositionUpdatedEvent } from '../positions/events/position-updated.event';
import { PositionsService } from '../positions/positions.service';
import { UserAccessService } from '../user-access/user-access.service';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { FindAllPositionHistoryDto } from './dto/find-all-position-history.dto';
import { FindOnePositionHistoryDto } from './dto/find-one-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistory } from './entities/position-history.entity';

@Injectable()
export class PositionHistoryService extends BaseUserAccess {
    constructor(
        @InjectRepository(PositionHistory) private repository: Repository<PositionHistory>,
        @Inject(forwardRef(() => PositionsService)) private readonly positionsService: PositionsService,
        @Inject(forwardRef(() => PayPeriodService)) private readonly payPeriodService: PayPeriodService,
        @Inject(forwardRef(() => UserAccessService)) public userAccessService: UserAccessService,
        private eventEmitter: EventEmitter2,
    ) {
        super(userAccessService, Resource.Position);
    }

    async getCompanyId(entityId: string): Promise<string> {
        const { positionId } = await this.repository.findOneOrFail({
            select: { positionId: true },
            where: { id: entityId },
            withDeleted: true,
        });
        return (await this.positionsService.findOne(positionId, { withDeleted: true })).companyId;
    }

    async getPositionCompanyId(positionId: string): Promise<string> {
        return (await this.positionsService.findOne(positionId, { withDeleted: true })).companyId;
    }

    async create(userId: string, payload: CreatePositionHistoryDto): Promise<PositionHistory> {
        const companyId = await this.getPositionCompanyId(payload.positionId);
        await this.requireAccessOrFail(userId, Action.Create, { companyId });
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

    async findAll(userId: string, params: FindAllPositionHistoryDto): Promise<PositionHistory[]> {
        const companyId = await this.getPositionCompanyId(params.positionId);
        await this.requireAccessOrFail(userId, Action.Read, { companyId });
        const position = params.onPayPeriodDate ? await this.positionsService.findOne(params.positionId) : null;
        const payPeriod =
            params.onPayPeriodDate && position
                ? await this.payPeriodService.findOneBy({
                      where: { companyId: position.companyId, dateFrom: params.onPayPeriodDate },
                  })
                : null;
        const response = await this.repository.find({
            where: {
                positionId: params.positionId,
                ...(params.onDate ? { dateFrom: LessThanOrEqual(params.onDate) } : {}),
                ...(params.onDate ? { dateTo: MoreThanOrEqual(params.onDate) } : {}),
                ...(params.onPayPeriodDate && payPeriod ? { dateFrom: LessThanOrEqual(payPeriod.dateTo) } : {}),
                ...(params.onPayPeriodDate && payPeriod ? { dateTo: MoreThanOrEqual(payPeriod.dateFrom) } : {}),
            },
            relations: {
                position: !!params.relations,
                department: !!params.relations,
                job: !!params.relations,
                workTimeNorm: !!params.relations,
                paymentType: !!params.relations,
            },
        });
        if (!!params.last && response.length > 1) {
            response.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
            return [response[response.length - 1]];
        }
        return response;
    }

    async findOne(userId: string, id: string, params?: FindOnePositionHistoryDto): Promise<PositionHistory> {
        await this.requireAccessOrFail(userId, Action.Read, { resourceId: id });
        return await this.repository.findOneOrFail({
            where: { id },
            relations: {
                position: !!params?.relations,
                department: !!params?.relations,
                job: !!params?.relations,
                workTimeNorm: !!params?.relations,
                paymentType: !!params?.relations,
            },
        });
    }

    async update(
        userId: string,
        id: string,
        version: number,
        payload: UpdatePositionHistoryDto,
    ): Promise<PositionHistory> {
        await this.requireAccessOrFail(userId, Action.Update, { resourceId: id });
        const record = await this.repository.findOneOrFail({ where: { id } });
        await this.repository.update(
            { id, version },
            {
                ...payload,
                updatedUserId: userId,
                updatedDate: new Date(),
            },
        );
        const updated = await this.repository.findOneOrFail({ where: { id } });
        await this.normalizeAfterCreateOrUpdate(userId, updated);
        const position = await this.positionsService.findOne(record.positionId);
        this.eventEmitter.emit('position.updated', new PositionUpdatedEvent(userId, position));
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: string, id: string, version: number): Promise<PositionHistory> {
        await this.requireAccessOrFail(userId, Action.Remove, { resourceId: id });
        await this.repository.update({ id, version }, { deletedUserId: userId, deletedDate: new Date() });
        const deleted = await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
        await this.normalizeAfterDeleted(userId, deleted);
        const position = await this.positionsService.findOne(deleted.positionId);
        this.eventEmitter.emit('position.updated', new PositionUpdatedEvent(userId, position));
        return deleted;
    }

    private async normalizeAfterCreateOrUpdate(userId: string, record: PositionHistory): Promise<void> {
        const position = await this.positionsService.findOne(record.positionId);
        if (!position) {
            throw new NotFoundException('Position not found.');
        }
        const list = (await this.repository.find({ where: { positionId: record.positionId } })).sort(
            (a, b) => a.dateFrom.getTime() - b.dateFrom.getTime(),
        );
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

    private async normalizeAfterDeleted(userId: string, record: PositionHistory): Promise<void> {
        const position = await this.positionsService.findOne(record.positionId);
        if (!position) {
            throw new NotFoundException('Position not found.');
        }
        const list = (await this.repository.find({ where: { positionId: record.positionId } })).sort(
            (a, b) => a.dateFrom.getTime() - b.dateFrom.getTime(),
        );
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
