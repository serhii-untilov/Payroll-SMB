import { ConflictException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayPeriodState, ResourceType, formatPeriod } from '@repo/shared';
import {
    addMonths,
    addYears,
    endOfMonth,
    endOfYear,
    startOfDay,
    startOfMonth,
    startOfYear,
    subYears,
} from 'date-fns';
import { FindOneOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { CreatePayPeriodDto } from './dto/createPayPeriod.dto';
import { UpdatePayPeriodDto } from './dto/updatePayPeriod.dto';
import { PayPeriod, defaultFieldList } from './entities/payPeriod.entity';

@Injectable()
export class PayPeriodsService extends AvailableForUserCompany {
    private logger: Logger = new Logger(PayPeriodsService.name);
    public readonly resourceType = ResourceType.PAY_PERIOD;

    constructor(
        @InjectRepository(PayPeriod)
        private repository: Repository<PayPeriod>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        return (await this.repository.findOneOrFail({ where: { id: entityId } })).companyId;
    }

    async create(userId: number, payload: CreatePayPeriodDto): Promise<PayPeriod> {
        const existing = await this.repository.findOneBy({
            companyId: payload.companyId,
            dateFrom: payload.dateFrom,
            dateTo: payload.dateTo,
        });
        if (existing) {
            throw new ConflictException(
                `Pay Period '${formatPeriod(payload.dateFrom, payload.dateTo)}' already exists.`,
            );
        }
        const intersection = await this.repository.findOneBy({
            companyId: payload.companyId,
            dateFrom: LessThanOrEqual(payload.dateTo),
            dateTo: MoreThanOrEqual(payload.dateFrom),
        });
        if (intersection) {
            throw new ConflictException(
                `Pay Period '${formatPeriod(payload.dateFrom, payload.dateTo)}' intersects with period '${formatPeriod(intersection.dateFrom, intersection.dateTo)}'.`,
            );
        }
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(
        companyId: number,
        relations: boolean = false,
        fullFieldList: boolean = false,
        dateFrom: Date = null,
        dateTo: Date = null,
    ): Promise<PayPeriod[]> {
        if (companyId) {
            return await this.repository.find({
                ...(fullFieldList ? {} : defaultFieldList),
                where: {
                    companyId,
                    ...(dateFrom ? { dateFrom: MoreThanOrEqual(dateFrom) } : {}),
                    ...(dateTo ? { dateTo: LessThanOrEqual(dateTo) } : {}),
                },
                relations: {
                    company: relations,
                },
                order: { dateFrom: 'ASC' },
            });
        } else {
            // Fake period list for creating company
            const dateFrom = subYears(startOfYear(new Date()), 1);
            const dateTo = addYears(endOfYear(dateFrom), 1);
            return getPeriodList(dateFrom, dateTo);
        }
    }

    async findOne(params: FindOneOptions<PayPeriod>): Promise<PayPeriod> {
        return await this.repository.findOneOrFail(params);
    }

    async find(params: FindOneOptions<PayPeriod>): Promise<PayPeriod | null> {
        return await this.repository.findOne(params);
    }

    async update(userId: number, id: number, payload: UpdatePayPeriodDto): Promise<PayPeriod> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        return await this.repository.save({ ...payload, id, updatedUserId: userId });
    }

    async remove(userId: number, id: number): Promise<PayPeriod> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(ids: number[]): Promise<void> {
        await this.repository.delete(ids);
    }

    async findCurrent(
        userId: number,
        companyId: number | null,
        relations: boolean,
        fullFieldList: boolean,
    ): Promise<PayPeriod> {
        if (!companyId) {
            return Object.assign(new PayPeriod(), {
                id: null,
                companyId: null,
                dateFrom: startOfMonth(new Date()),
                dateTo: startOfDay(endOfMonth(new Date())),
                state: PayPeriodState.OPENED,
            });
        }
        const company = await this.companiesService.findOne(userId, companyId);
        const options = {
            where: { companyId: company.id, dateFrom: company.payPeriod },
            relations: { company: relations },
            ...(fullFieldList ? {} : defaultFieldList),
        };
        return await this.findOne(options);
    }

    async countClosed(companyId: number): Promise<number> {
        const { count } = await this.repository
            .createQueryBuilder('pay_period')
            .select('COUNT(*)', 'count')
            .where('"companyId" = :companyId', { companyId })
            .andWhere('"deletedDate" is null')
            .andWhere('"state" = :state', { state: PayPeriodState.CLOSED })
            .getRawOne();
        return Number(count);
    }
}

function getPeriodList(dateFrom: Date, dateTo: Date): PayPeriod[] {
    const periodList: PayPeriod[] = [];
    for (
        let d = startOfMonth(dateFrom);
        d.getTime() < endOfMonth(dateTo).getTime();
        d = addMonths(d, 1)
    ) {
        const period = Object.assign({
            id: 0,
            companyId: 0,
            dateFrom: startOfMonth(d),
            dateTo: endOfMonth(d),
            state: PayPeriodState.OPENED,
        });
        periodList.push(period);
    }
    return periodList;
}
