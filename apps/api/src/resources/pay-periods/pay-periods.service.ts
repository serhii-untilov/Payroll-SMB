import { PayPeriodState, Resource } from '@/types';
import { checkVersionOrFail } from '@/utils';
import {
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dateUTC, formatPeriod, monthBegin, monthEnd } from '@repo/shared';
import { add, addMonths, addYears, endOfYear, startOfYear, sub, subYears } from 'date-fns';
import { FindOneOptions, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/available-for-user-company';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import {
    ClosePayPeriodDto,
    CreatePayPeriodDto,
    FindAllPayPeriodDto,
    FindCurrentPayPeriodDto,
    FindOnePayPeriodDto,
    OpenPayPeriodDto,
    UpdatePayPeriodDto,
} from './dto';
import { PayPeriod, defaultFieldList } from './entities';

@Injectable()
export class PayPeriodsService extends AvailableForUserCompany {
    private _logger: Logger = new Logger(PayPeriodsService.name);
    public readonly resource = Resource.PayPeriod;

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

    async getCompanyId(entityId: string): Promise<string> {
        return (await this.repository.findOneOrFail({ where: { id: entityId }, withDeleted: true }))
            .companyId;
    }

    async create(userId: string, payload: CreatePayPeriodDto): Promise<PayPeriod> {
        const existing = await this.repository.findOneBy({
            companyId: payload.companyId,
            dateFrom: payload.dateFrom,
            dateTo: payload.dateTo,
        });
        if (existing) {
            throw new HttpException(
                `Pay Period '${formatPeriod(payload.dateFrom, payload.dateTo)}' already exists.`,
                HttpStatus.CONFLICT,
            );
        }
        const intersection = await this.repository.findOneBy({
            companyId: payload.companyId,
            dateFrom: LessThanOrEqual(payload.dateTo),
            dateTo: MoreThanOrEqual(payload.dateFrom),
        });
        if (intersection) {
            throw new HttpException(
                `Pay Period '${formatPeriod(payload.dateFrom, payload.dateTo)}'
                intersects with period
                '${formatPeriod(intersection.dateFrom, intersection.dateTo)}'.`,
                HttpStatus.CONFLICT,
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

    async findOne(id: string, params?: FindOnePayPeriodDto): Promise<PayPeriod> {
        return await this.repository.findOneOrFail({
            where: { id },
            relations: { company: !!params?.relations },
            ...(!!params?.fullFieldList ? {} : defaultFieldList),
        });
    }

    async findOneBy(params: FindOneOptions<PayPeriod>): Promise<PayPeriod> {
        const found = await this.repository.findOne(params);
        if (!found) throw new NotFoundException('Pay Period not found');
        return found;
    }

    async update(userId: string, id: string, payload: UpdatePayPeriodDto): Promise<PayPeriod> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        return await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
    }

    async remove(userId: string, id: string): Promise<PayPeriod> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async delete(ids: string[]): Promise<void> {
        if (ids.length) {
            await this.repository.delete(ids);
        }
    }

    async findCurrent(userId: string, params: FindCurrentPayPeriodDto): Promise<PayPeriod> {
        const { companyId, fullFieldList, relations } = params;
        if (!companyId) {
            return Object.assign(new PayPeriod(), {
                id: null,
                companyId: null,
                dateFrom: monthBegin(new Date()),
                dateTo: monthEnd(new Date()),
                state: PayPeriodState.Opened,
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

    async countClosed(companyId: string): Promise<number> {
        const { count } = await this.repository
            .createQueryBuilder('pay_period')
            .select('COUNT(*)', 'count')
            .where('"companyId" = :companyId', { companyId })
            .andWhere('"deletedDate" is null')
            .andWhere('"state" = :state', { state: PayPeriodState.Closed })
            .getRawOne();
        return Number(count);
    }

    async close(
        userId: string,
        currentPayPeriodId: string,
        payload: ClosePayPeriodDto,
    ): Promise<PayPeriod> {
        const current = await this.repository.findOneOrFail({ where: { id: currentPayPeriodId } });
        checkVersionOrFail(current, payload);
        const company = await this.companiesService.findOne(userId, current.companyId);
        if (company.payPeriod.getTime() !== current.dateFrom.getTime()) {
            throw new HttpException(
                `The record doesn't current period. Try again after reloading.`,
                HttpStatus.CONFLICT,
            );
        }
        const nextDateFrom = dateUTC(add(current.dateTo, { days: 1 }));
        const next = await this.repository.findOneOrFail({
            where: { companyId: current.companyId, dateFrom: nextDateFrom },
        });
        if (current.state !== PayPeriodState.Closed) {
            await this.repository.save({
                id: currentPayPeriodId,
                state: PayPeriodState.Closed,
                updatedUserId: userId,
                updatedDate: new Date(),
            });
        }
        if (next.state !== PayPeriodState.Opened) {
            await this.repository.save({
                id: next.id,
                state: PayPeriodState.Opened,
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

    async open(
        userId: string,
        currentPayPeriodId: string,
        payload: OpenPayPeriodDto,
    ): Promise<PayPeriod> {
        const current = await this.repository.findOneOrFail({ where: { id: currentPayPeriodId } });
        checkVersionOrFail(current, payload);
        if (current.state !== PayPeriodState.Opened) {
            throw new HttpException('The given period is not opened.', HttpStatus.CONFLICT);
        }
        const company = await this.companiesService.findOne(userId, current.companyId);
        if (company.payPeriod.getTime() !== current.dateFrom.getTime()) {
            throw new HttpException(
                `The record doesn't current period. Try again after reloading.`,
                HttpStatus.CONFLICT,
            );
        }
        const priorDateTo = dateUTC(sub(current.dateFrom, { days: 1 }));
        const prior = await this.repository.findOneOrFail({
            where: { companyId: current.companyId, dateTo: priorDateTo },
        });
        if (prior.state !== PayPeriodState.Opened) {
            await this.repository.save({
                id: prior.id,
                state: PayPeriodState.Opened,
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
            state: PayPeriodState.Opened,
        });
        periodList.push(period);
    }
    return periodList;
}
