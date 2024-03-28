import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { formatPeriod } from '../../utils/date';
import { CompaniesService } from '../companies/companies.service';
import { UsersService } from '../users/users.service';
import { CreatePayPeriodDto } from './dto/create-pay-period.dto';
import { UpdatePayPeriodDto } from './dto/update-pay-period.dto';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodState, PaymentSchedule } from '@repo/shared';
import {
    addDays,
    addMonths,
    addYears,
    endOfMonth,
    endOfYear,
    max,
    min,
    startOfMonth,
    startOfYear,
    subYears,
} from 'date-fns';

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

    async findAll(userId: number, companyId: number, params): Promise<PayPeriod[]> {
        const resp = await this.repository.find(params);
        if (resp.length) return resp;
        await this.fill(userId, companyId);
        return await this.repository.find(params);
    }

    async findOne(params): Promise<PayPeriod> {
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

    async fill(userId: number, companyId: number) {
        const company = await this.companiesService.findOne({ where: { id: companyId } });
        const lastPeriod = await this.getLastClosedPeriod(company.id);
        const filler = getFiller(company.paymentSchedule);
        const dateFrom = lastPeriod?.dateTo
            ? addDays(lastPeriod?.dateTo, 1)
            : normalizeDateFrom(company.dateFrom);
        const dateTo = normalizeDateTo(company.dateTo);
        const periods = filler(company.id, dateFrom, dateTo);
        if (periods.length) {
            await this.deleteOpenedPeriods(companyId, dateFrom);
            await this.save(userId, periods);
        }
    }

    async save(userId: number, periods: PayPeriod[]) {
        periods.forEach((period) => {
            this.create(userId, period);
        });
    }

    async getLastClosedPeriod(companyId: number): Promise<PayPeriod> {
        // Aggregating. To select a sum, min, max or average you have to use a query builder and getRawOne().
        const { maxDateTo } = await this.repository
            .createQueryBuilder('lastPeriod')
            .select('MAX(dateTo)', 'maxDateTo')
            .where('companyId = :companyId and state = :state', {
                companyId,
                state: PayPeriodState.CLOSED,
            })
            .getRawOne();
        if (!maxDateTo) return null;
        return this.repository.findOne({ where: { companyId, dateTo: maxDateTo } });
    }

    async deleteOpenedPeriods(companyId: number, dateFrom: Date) {
        await this.repository
            .createQueryBuilder('deleteOpenedPeriods')
            .delete()
            .where('companyId = :companyId and state = :state', {
                companyId,
                state: PayPeriodState.OPENED,
                dateFrom: MoreThanOrEqual(dateFrom),
            });
    }
}

function getFiller(paymentSchedule: PaymentSchedule | string) {
    switch (paymentSchedule) {
        case PaymentSchedule.EVERY_15_DAY:
            return fillPeriodsEvery15days;
        case PaymentSchedule.LAST_DAY:
            return fillPeriodsLastDay;
        case PaymentSchedule.NEXT_MONTH:
            return fillPeriodsLastDay;
    }
    throw new NotFoundException('PaymentSchedule not defined');
}

function fillPeriodsLastDay(companyId: number, dateFrom: Date, dateTo: Date): PayPeriod[] {
    const periods = [];
    for (let d = dateFrom; d < dateTo; d = addMonths(d, 1)) {
        periods.push({
            companyId,
            dateFrom: max([dateFrom, startOfMonth(d)]),
            dateTo: endOfMonth(d),
            state: PayPeriodState.OPENED,
        });
    }
    return periods;
}

function fillPeriodsEvery15days(companyId: number, dateFrom: Date, dateTo: Date): PayPeriod[] {
    const periods = [];
    for (let d = dateFrom; d < dateTo; d = addMonths(d, 1)) {
        let df = max([dateFrom, startOfMonth(d)]);
        let dt = min([dateTo, addDays(startOfMonth(d), 14)]);
        if (df <= dt) {
            periods.push({
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
                companyId,
                dateFrom: max([dateFrom, startOfMonth(d)]),
                dateTo: endOfMonth(d),
                state: PayPeriodState.OPENED,
            });
        }
    }
    return periods;
}

function normalizeDateFrom(dateFrom: Date) {
    const minPeriod = subYears(startOfYear(new Date()), 1);
    return max([dateFrom, minPeriod]);
}

function normalizeDateTo(dateTo: Date) {
    const maxPeriod = addYears(endOfYear(new Date()), 1);
    return min([dateTo, maxPeriod]);
}
