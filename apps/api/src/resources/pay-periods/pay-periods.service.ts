import { ConflictException, Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    PayPeriodState,
    ResourceType,
    dateUTC,
    formatPeriod,
    monthBegin,
    monthEnd,
} from '@repo/shared';
import { add, addMonths, addYears, endOfYear, startOfYear, sub, subYears } from 'date-fns';
import { FindOneOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriod, defaultFieldList } from './entities/pay-period.entity';
import { FindAllPayPeriodDto } from './dto/find-all-pay-period.dto';
import { FindCurrentPayPeriodDto } from './dto/find-current-pay-period.dto';

@Injectable()
export class PayPeriodsService extends AvailableForUserCompany {
    private _logger: Logger = new Logger(PayPeriodsService.name);
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

    async findAll(params: FindAllPayPeriodDto): Promise<PayPeriod[]> {
        const { companyId, dateFrom, dateTo, fullFieldList, relations } = params;
        if (companyId) {
            return await this.repository.find({
                ...(fullFieldList ? {} : defaultFieldList),
                where: {
                    companyId: companyId,
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

    async findOneOrFail(params: FindOneOptions<PayPeriod>): Promise<PayPeriod> {
        return await this.repository.findOneOrFail(params);
    }

    async findOne(params: FindOneOptions<PayPeriod>): Promise<PayPeriod | null> {
        return await this.repository.findOne(params);
    }

    async update(userId: number, id: number, payload: UpdatePayPeriodDto): Promise<PayPeriod> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        return await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
    }

    async remove(userId: number, id: number): Promise<PayPeriod> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(ids: number[]): Promise<void> {
        if (ids.length) {
            await this.repository.delete(ids);
        }
    }

    async findCurrent(userId: number, params: FindCurrentPayPeriodDto): Promise<PayPeriod> {
        const { companyId, fullFieldList, relations } = params;
        if (!companyId) {
            return Object.assign(new PayPeriod(), {
                id: null,
                companyId: null,
                dateFrom: monthBegin(new Date()),
                dateTo: monthEnd(new Date()),
                state: PayPeriodState.OPENED,
            });
        }
        const company = await this.companiesService.findOne(userId, companyId);
        const options = {
            where: { companyId: company.id, dateFrom: company.payPeriod },
            relations: { company: relations },
            ...(fullFieldList ? {} : defaultFieldList),
        };
        const payPeriod = await this.repository.findOneOrFail(options);
        return payPeriod;
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

    async close(userId: number, currentPayPeriodId: number, version: number): Promise<PayPeriod> {
        const current = await this.repository.findOneOrFail({ where: { id: currentPayPeriodId } });
        if (version !== current.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try again after reloading.',
            );
        }
        const company = await this.companiesService.findOne(userId, current.companyId);
        if (company.payPeriod.getTime() !== current.dateFrom.getTime()) {
            throw new ConflictException(
                `The record doesn't current period. Try again after reloading.`,
            );
        }
        const nextDateFrom = dateUTC(add(current.dateTo, { days: 1 }));
        const next = await this.repository.findOneOrFail({
            where: { companyId: current.companyId, dateFrom: nextDateFrom },
        });
        if (current.state !== PayPeriodState.CLOSED) {
            await this.repository.save({
                id: currentPayPeriodId,
                state: PayPeriodState.CLOSED,
                updatedUserId: userId,
                updatedDate: new Date(),
            });
        }
        if (next.state !== PayPeriodState.OPENED) {
            await this.repository.save({
                id: next.id,
                state: PayPeriodState.OPENED,
                updatedUserId: userId,
                updatedDate: new Date(),
            });
        }
        await this.companiesService.update(userId, company.id, {
            payPeriod: next.dateFrom,
            version: company.version,
        });
        return await this.repository.findOneOrFail({ where: { id: next.id } });
    }

    async open(userId: number, currentPayPeriodId: number, version: number): Promise<PayPeriod> {
        const current = await this.repository.findOneOrFail({ where: { id: currentPayPeriodId } });
        if (version !== current.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        if (current.state !== PayPeriodState.OPENED) {
            throw new ConflictException('The given period is not opened.');
        }
        const company = await this.companiesService.findOne(userId, current.companyId);
        if (company.payPeriod.getTime() !== current.dateFrom.getTime()) {
            throw new ConflictException(
                `The record doesn't current period. Try again after reloading.`,
            );
        }
        const priorDateTo = dateUTC(sub(current.dateFrom, { days: 1 }));
        const prior = await this.repository.findOneOrFail({
            where: { companyId: current.companyId, dateTo: priorDateTo },
        });
        if (prior.state !== PayPeriodState.OPENED) {
            await this.repository.save({
                id: prior.id,
                state: PayPeriodState.OPENED,
                updatedUserId: userId,
                updatedDate: new Date(),
            });
        }
        await this.companiesService.update(userId, company.id, {
            payPeriod: prior.dateFrom,
            version: company.version,
        });
        return await this.repository.findOneOrFail({ where: { id: prior.id } });
    }
}

function getPeriodList(dateFrom: Date, dateTo: Date): PayPeriod[] {
    const periodList: PayPeriod[] = [];
    for (
        let d = monthBegin(dateFrom);
        d.getTime() < monthEnd(dateTo).getTime();
        d = addMonths(d, 1)
    ) {
        const period = Object.assign({
            id: 0,
            companyId: 0,
            dateFrom: monthBegin(d),
            dateTo: monthEnd(d),
            state: PayPeriodState.OPENED,
        });
        periodList.push(period);
    }
    return periodList;
}
