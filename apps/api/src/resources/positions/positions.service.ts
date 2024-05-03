import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from './../pay-periods/pay-periods.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
    public readonly resourceType = ResourceType.POSITION;

    constructor(
        @InjectRepository(Position)
        private repository: Repository<Position>,
        @Inject(forwardRef(() => PayPeriodsService))
        private readonly payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreatePositionDto): Promise<Position> {
        if (payload?.cardNumber) {
            const existing = payload?.cardNumber
                ? await this.repository.findOne({
                      where: { cardNumber: payload.cardNumber },
                  })
                : null;
            if (existing) {
                throw new BadRequestException(`Position '${payload.cardNumber}' already exists.`);
            }
        }
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            payload.companyId,
            this.resourceType,
            AccessType.CREATE,
        );
        const cardNumber = payload?.cardNumber || (await this.getNextCardNumber(payload.companyId));
        return await this.repository.save({
            ...payload,
            cardNumber,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(
        userId: number,
        companyId: number,
        relations: boolean,
        onDate: Date,
    ): Promise<Position[]> {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const payPeriod = onDate
            ? await this.payPeriodsService.findOne(userId, {
                  where: {
                      companyId,
                      dateFrom: LessThanOrEqual(onDate),
                      dateTo: MoreThanOrEqual(onDate),
                  },
              })
            : null;
        return await this.repository.find({
            relations: {
                company: relations,
                person: relations,
                history:
                    relations && payPeriod
                        ? { department: true, job: true, workNorm: true, paymentType: true }
                        : false,
            },
            where: {
                companyId,
                ...(payPeriod ? { dateFrom: LessThanOrEqual(payPeriod.dateTo) } : {}),
                ...(payPeriod ? { dateTo: MoreThanOrEqual(payPeriod.dateFrom) } : {}),
                ...(relations && payPeriod
                    ? {
                          history: {
                              dateTo: MoreThanOrEqual(payPeriod.dateFrom),
                              dateFrom: LessThanOrEqual(payPeriod.dateTo),
                          },
                      }
                    : {}),
            },
        });
    }

    async findOne(
        userId: number,
        id: number,
        relations: boolean = null,
        onDate: Date = null,
    ): Promise<Position> {
        const position = await this.repository.findOneOrFail({
            where: { id },
            relations: {
                company: relations,
                person: relations,
            },
        });
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            position.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        if (!(onDate && relations)) {
            return position;
        }
        const payPeriod = await this.payPeriodsService.findOne(userId, {
            where: {
                companyId: position.companyId,
                dateFrom: LessThanOrEqual(onDate),
                dateTo: MoreThanOrEqual(onDate),
            },
        });
        return await this.repository.findOneOrFail({
            relations: {
                company: relations,
                person: relations,
                history:
                    relations && payPeriod
                        ? { department: true, job: true, workNorm: true, paymentType: true }
                        : false,
            },
            where: {
                id,
                ...(relations && payPeriod
                    ? {
                          history: {
                              dateTo: MoreThanOrEqual(payPeriod.dateFrom),
                              dateFrom: LessThanOrEqual(payPeriod.dateTo),
                          },
                      }
                    : {}),
            },
        });
    }

    async update(userId: number, id: number, payload: UpdatePositionDto): Promise<Position> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            record.companyId,
            this.resourceType,
            AccessType.UPDATE,
        );
        return await this.repository.save({ ...payload, id, updatedUserId: userId });
    }

    async remove(userId: number, id: number): Promise<Position> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            record.companyId,
            this.resourceType,
            AccessType.DELETE,
        );
        return await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
    }

    async getNextCardNumber(companyId: number): Promise<string> {
        const result = await this.repository.query(
            `select coalesce(min(cast(p."cardNumber" as integer)), 0) + 1 "freeNumber"
            from position p
            where p."companyId" = $1
                and p."deletedUserId" is NULL
                and p."cardNumber" ~ '^[0-9\.]+$' is true
                and not exists (
                    select null
                    from position p2
                    where p2."companyId" = $2
                        and p2."deletedUserId" is NULL
                        and (p2."cardNumber") ~ '^[0-9\.]+$' is true
                        and cast(p2."cardNumber" as integer) = cast(p."cardNumber" as integer)  + 1
                )
            `,
            [companyId, companyId],
        );

        return result[0].freeNumber.toString();
    }
}
