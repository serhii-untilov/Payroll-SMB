import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { FindOptionsWhere, Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PositionsService } from '../positions/positions.service';
import { CreatePositionHistoryDto } from './dto/create-position-history.dto';
import { UpdatePositionHistoryDto } from './dto/update-position-history.dto';
import { PositionHistory } from './entities/position-history.entity';
import { FindPositionHistoryDto } from './dto/find-position-history.dto';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';

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
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
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
        return await this.repository.save({ ...payload, id, updatedUserId: userId });
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
        return await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }

    async find(userId: number, params: FindPositionHistoryDto): Promise<PositionHistory | null> {
        const position = await this.positionsService.findOne(userId, params.positionId);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const where: FindOptionsWhere<PositionHistory> =
            params as FindOptionsWhere<PositionHistory>;
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
        return this.repository.findOne({
            where,
            relations: {
                position: true,
                department: true,
                job: true,
                workNorm: true,
                paymentType: true,
            },
        });
    }
}
