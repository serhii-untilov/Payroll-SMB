import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PayPeriodState, PaymentSchedule } from '@repo/shared';
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
import { formatPeriod } from '../../utils/date';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriod, defaultFieldList } from './entities/pay-period.entity';

@Injectable()
export class PayPeriodsService {
    private logger: Logger = new Logger(PayPeriodsService.name);
    constructor(
        @InjectRepository(PayPeriod)
        private repository: Repository<PayPeriod>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
    ) {}

    async create(userId: number, payload: CreatePayPeriodDto): Promise<PayPeriod> {
        const existing = await this.repository.findOneBy({
            companyId: payload.companyId,
            dateFrom: payload.dateFrom,
            dateTo: payload.dateTo,
        });
        if (existing) {
            throw new BadRequestException(
                `Pay period '${formatPeriod(payload.dateFrom, payload.dateTo)}' already exists.`,
            );
        }
        const intersection = await this.repository.findOneBy({
            companyId: payload.companyId,
            dateFrom: LessThanOrEqual(payload.dateTo),
            dateTo: MoreThanOrEqual(payload.dateFrom),
        });
        if (intersection) {
            throw new BadRequestException(
                `Pay period '${formatPeriod(payload.dateFrom, payload.dateTo)}' intersects with period '${formatPeriod(intersection.dateFrom, intersection.dateTo)}'.`,
            );
        }
        const user = await this.usersService.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        const company = await this.companiesService.findOne({ where: { id: payload.companyId } });
        if (!company) {
            throw new BadRequestException(`Company '${payload.companyId}' not found.`);
        }
        const newPayPeriod = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return newPayPeriod;
    }

    async findAll(
        userId: number,
        companyId: number,
        params: FindManyOptions<PayPeriod>,
    ): Promise<PayPeriod[]> {
        const options: FindManyOptions<PayPeriod> = { order: { dateFrom: 'ASC' }, ...params };
        const response = await this.repository.find(options);
        if (response.length) return response;
        await this.fillPeriods(userId, companyId);
        return await this.repository.find(options);
    }

    async findOne(params: FindOneOptions<PayPeriod>): Promise<PayPeriod> {
        const PayPeriod = await this.repository.findOne(params);
        if (!PayPeriod) {
            throw new NotFoundException(`PayPeriod could not be found.`);
        }
        return PayPeriod;
    }

    async update(userId: number, id: number, data: UpdatePayPeriodDto): Promise<PayPeriod> {
        const PayPeriod = await this.repository.findOneBy({ id });
        if (!PayPeriod) {
            throw new NotFoundException(`PayPeriod could not be found.`);
        }
        const user = await this.usersService.findOne({ where: { id: userId } });
        await this.companiesService.findOne({ where: { id: PayPeriod.companyId } });
        await this.repository.save({
            ...data,
            id,
            updatedUserId: user.id,
        });
        const updated = await this.repository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<PayPeriod> {
        const PayPeriod = await this.repository.findOneBy({ id });
        if (!PayPeriod) {
            throw new NotFoundException(`PayPeriod could not be found.`);
        }
        const user = await this.usersService.findOne({ where: { id: userId } });
        await this.repository.save({
            ...PayPeriod,
            deletedDate: new Date(),
            deletedUserId: user.id,
        });
        return PayPeriod;
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
        const company = await this.companiesService.findOne({ where: { id: companyId } });
        const options = {
            where: { companyId: company.id, dateFrom: company.payPeriod },
            relations: { company: relations },
            ...(fullFieldList ? {} : defaultFieldList),
        };
        const resp = await this.findOne(options);
        if (resp) return resp;
        await this.fillPeriods(userId, company.id);
        return await this.findOne(options);
    }

    async fillPeriods(userId: number, companyId: number | null): Promise<PayPeriod[]> {
        if (!companyId) {
            const filler = getFiller(PaymentSchedule.LAST_DAY);
            return filler(null, getDateFrom(new Date()), getDateTo(new Date()));
        }
        const company = await this.companiesService.findOne({ where: { id: companyId } });
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
