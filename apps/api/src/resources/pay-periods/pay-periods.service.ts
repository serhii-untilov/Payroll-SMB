import {
    ConflictException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AccessType,
    PayPeriodState,
    PaymentSchedule,
    ResourceType,
    formatPeriod,
} from '@repo/shared';
import {
    addDays,
    addMonths,
    addYears,
    endOfMonth,
    endOfYear,
    max,
    min,
    startOfDay,
    startOfMonth,
    startOfYear,
    subYears,
} from 'date-fns';
import {
    FindManyOptions,
    FindOneOptions,
    LessThanOrEqual,
    MoreThanOrEqual,
    Not,
    Repository,
} from 'typeorm';
import { AccessService } from '../access/access.service';
import { CompaniesService } from '../companies/companies.service';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriod, defaultFieldList } from './entities/pay-period.entity';

@Injectable()
export class PayPeriodsService {
    private logger: Logger = new Logger(PayPeriodsService.name);
    public readonly resourceType = ResourceType.PAY_PERIOD;

    constructor(
        @InjectRepository(PayPeriod)
        private repository: Repository<PayPeriod>,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

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
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            payload.companyId,
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
        companyId: number,
        params: FindManyOptions<PayPeriod>,
    ): Promise<PayPeriod[]> {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const options: FindManyOptions<PayPeriod> = { order: { dateFrom: 'ASC' }, ...params };
        const payPeriodList = await this.repository.find(options);
        if (payPeriodList.length) return payPeriodList;
        await this.fillPeriods(userId, companyId);
        return await this.repository.find(options);
    }

    async findOne(userId: number, params: FindOneOptions<PayPeriod>): Promise<PayPeriod> {
        const payPeriod = await this.repository.findOneOrFail(params);
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            payPeriod.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return payPeriod;
    }

    async update(userId: number, id: number, payload: UpdatePayPeriodDto): Promise<PayPeriod> {
        const payPeriod = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            payPeriod.companyId,
            this.resourceType,
            AccessType.UPDATE,
        );
        return await this.repository.save({ ...payload, id, updatedUserId: userId });
    }

    async remove(userId: number, id: number): Promise<PayPeriod> {
        const payPeriod = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            payPeriod.companyId,
            this.resourceType,
            AccessType.DELETE,
        );
        return await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
    }

    async findCurrent(
        userId: number,
        companyId: number | null,
        relations: boolean,
        fullFieldList: boolean,
    ): Promise<PayPeriod> {
        if (!companyId) {
            return {
                id: null,
                companyId: null,
                dateFrom: startOfMonth(new Date()),
                dateTo: startOfDay(endOfMonth(new Date())),
                state: PayPeriodState.OPENED,
            };
        }
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const company = await this.companiesService.findOne(userId, companyId);
        const options = {
            where: { companyId: company.id, dateFrom: company.payPeriod },
            relations: { company: relations },
            ...(fullFieldList ? {} : defaultFieldList),
        };
        const resp = await this.findOne(userId, options);
        if (resp) return resp;
        await this.fillPeriods(userId, company.id);
        return await this.findOne(userId, options);
    }

    async fillPeriods(userId: number, companyId: number | null): Promise<PayPeriod[]> {
        if (!companyId) {
            const filler = getFiller(PaymentSchedule.LAST_DAY);
            return filler(null, getDateFrom(new Date()), getDateTo(new Date()));
        }
        const company = await this.companiesService.findOne(userId, companyId);
        const dateFrom = getDateFrom(company.payPeriod);
        const dateTo = getDateTo(company.payPeriod);
        const filler = getFiller(company.paymentSchedule);
        const periods = filler(company.id, dateFrom, dateTo);
        if (periods.length) {
            // Delete opened periods
            await this.repository
                .createQueryBuilder('deleteOpenedPeriods')
                .delete()
                .where({
                    companyId,
                    state: PayPeriodState.OPENED,
                    dateFrom: MoreThanOrEqual(dateFrom),
                });
            // Get not opened periods
            const closed = await this.repository.find({
                where: {
                    companyId: company.id,
                    dateFrom: MoreThanOrEqual(dateFrom),
                    dateTo: LessThanOrEqual(dateTo),
                    state: Not(PayPeriodState.OPENED),
                },
            });
            // Save non intersected periods
            await this.save(
                userId,
                periods.filter(
                    (p) =>
                        !closed.find(
                            (c) =>
                                c.dateFrom.getTime() <= p.dateTo.getTime() &&
                                c.dateTo.getTime() >= p.dateFrom.getTime(),
                        ),
                ),
            );
        }
    }

    async save(userId: number, periods: PayPeriod[]) {
        periods.forEach((period) => {
            this.create(userId, period);
        });
    }

    async deleteOpenedPeriods(companyId: number, dateFrom: Date) {
        await this.repository
            .createQueryBuilder('deleteOpenedPeriods')
            .delete()
            .where({ companyId, dateFrom: MoreThanOrEqual(dateFrom) });
    }

    async generate(paymentSchedule: PaymentSchedule): Promise<PayPeriod[]> {
        const companyId = null;
        const payPeriod = startOfMonth(new Date());
        const filler = getFiller(paymentSchedule);
        return filler(companyId, getDateFrom(payPeriod), getDateTo(payPeriod));
    }
}

function getFiller(paymentSchedule: PaymentSchedule | string) {
    switch (paymentSchedule) {
        case PaymentSchedule.EVERY_15_DAY:
            return fillPeriods_Every15days;
        case PaymentSchedule.LAST_DAY:
            return fillPeriods_LastDay;
        case PaymentSchedule.NEXT_MONTH:
            return fillPeriods_LastDay;
    }
    throw new NotFoundException(`Wrong paymentSchedule: ${paymentSchedule}.`);
}

function fillPeriods_LastDay(companyId: number | null, dateFrom: Date, dateTo: Date): PayPeriod[] {
    const periods: PayPeriod[] = [];
    for (let d = dateFrom; d < dateTo; d = addMonths(d, 1)) {
        periods.push({
            id: null,
            companyId,
            dateFrom: max([dateFrom, startOfMonth(d)]),
            dateTo: endOfMonth(d),
            state: PayPeriodState.OPENED,
        });
    }
    return periods;
}

function fillPeriods_Every15days(
    companyId: number | null,
    dateFrom: Date,
    dateTo: Date,
): PayPeriod[] {
    const periods: PayPeriod[] = [];
    for (let d = dateFrom; d < dateTo; d = addMonths(d, 1)) {
        let df = max([dateFrom, startOfMonth(d)]);
        let dt = min([dateTo, addDays(startOfMonth(d), 14)]);
        if (df <= dt) {
            periods.push({
                id: null,
                companyId,
                dateFrom: df,
                dateTo: dt,
                state: PayPeriodState.OPENED,
            });
        }
        df = max([dateFrom, addDays(startOfMonth(d), 15)]);
        dt = min([dateTo, endOfMonth(d)]);
        if (df <= dt) {
            periods.push({
                id: null,
                companyId,
                dateFrom: max([dateFrom, startOfMonth(d)]),
                dateTo: endOfMonth(d),
                state: PayPeriodState.OPENED,
            });
        }
    }
    return periods;
}

function getDateFrom(payPeriod: Date) {
    return subYears(startOfYear(payPeriod), 1);
}

function getDateTo(payPeriod: Date) {
    return addYears(endOfYear(payPeriod), 1);
}
