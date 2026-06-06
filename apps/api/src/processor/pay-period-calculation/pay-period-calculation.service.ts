import {
    CompanyService,
    PayFundService,
    PayPeriodCalcMethodService,
    PayPeriodService,
    PayrollsService,
    PositionsService,
    UserService,
} from '@/resources';
import { PaymentPart, PaymentSchedule } from '@/types';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { dropTime } from '@repo/shared';
import { addYears, endOfYear, startOfYear, sub, subYears } from 'date-fns';
import { PayPeriodSummary } from '../../resources/pay-period/entities/pay-period-summary.entity';
import { PayPeriod } from './../../resources/pay-period/entities/pay-period.entity';
import { Context, PeriodListGenerator } from './calc-methods/base/period-list-generator';
import { EndOfMonthPayment } from './calc-methods/lib/end-of-month-payment';
import { Every15daysPayment } from './calc-methods/lib/every-15-days-payment';

@Injectable({ scope: Scope.REQUEST })
export class PayPeriodCalculationService {
    private logger: Logger = new Logger(PayPeriodCalculationService.name);

    constructor(
        @Inject(forwardRef(() => CompanyService)) private companiesService: CompanyService,
        @Inject(forwardRef(() => PayPeriodService)) private payPeriodService: PayPeriodService,
        @Inject(forwardRef(() => PayPeriodCalcMethodService))
        private payPeriodsCalcMethodService: PayPeriodCalcMethodService,
        @Inject(forwardRef(() => PayrollsService)) private payrollsService: PayrollsService,
        @Inject(forwardRef(() => PayFundService)) private payFundsService: PayFundService,
        @Inject(forwardRef(() => PositionsService)) private positionsService: PositionsService,
        @Inject(forwardRef(() => UserService)) private usersService: UserService,
    ) {}

    private async initContext(userId: string, companyId: string): Promise<Context> {
        const company = await this.companiesService.findOne(userId, companyId);
        return { userId, company };
    }

    private getGenerator(ctx: Context): PeriodListGenerator {
        if (ctx.company.paymentSchedule === PaymentSchedule.Every15day) {
            return new Every15daysPayment(ctx);
        } else if (ctx.company.paymentSchedule === PaymentSchedule.LastDay) {
            return new EndOfMonthPayment(ctx);
        } else {
            return new EndOfMonthPayment(ctx);
        }
    }

    async fillPeriods(userId: string, companyId: string): Promise<void> {
        const ctx = await this.initContext(userId, companyId);
        const dateFrom = subYears(startOfYear(ctx.company.payPeriod), 1);
        const dateTo = addYears(endOfYear(ctx.company.payPeriod), 1);
        const prior = await this.payPeriodService.findAll({ companyId, dateFrom, dateTo });
        // this._id = prior.reduce((a, b) => (a > b.id ? a : b.id), 0);
        const generator = this.getGenerator(ctx);
        const current = generator.getPeriodList(dateFrom, dateTo);
        const { toDelete, toInsert } = this.merge(prior, current);
        this.save(ctx, toDelete, toInsert);
    }

    private merge(priorList: PayPeriod[], currentList: PayPeriod[]) {
        const toDelete = priorList
            .filter(
                (prior) =>
                    !currentList.find(
                        (current) =>
                            dropTime(current.dateFrom) === dropTime(prior.dateFrom) &&
                            dropTime(current.dateTo) === dropTime(prior.dateTo),
                    ),
            )
            .map((prior) => prior.id);
        const toInsert = currentList.filter(
            (current) =>
                !priorList.find(
                    (prior) =>
                        dropTime(current.dateFrom) === dropTime(prior.dateFrom) &&
                        dropTime(current.dateTo) === dropTime(prior.dateTo),
                ),
        );
        return { toDelete, toInsert };
    }

    private async save(ctx: Context, toDelete: string[], toInsert: PayPeriod[]) {
        if (toDelete.length) {
            this.payPeriodService.delete(toDelete);
        }
        for (const { id: _, ...period } of toInsert) {
            this.payPeriodService.create(ctx.userId, period);
        }
    }

    async updateBalance(id: string): Promise<PayPeriod> {
        const payPeriod = await this.payPeriodService.findOneBy({ where: { id } });
        // Calculate In Balance
        const prior = await this.payPeriodService.findOneBy({
            where: { companyId: payPeriod.companyId, dateTo: sub(payPeriod.dateFrom, { days: 1 }) },
        });
        const inBalance = prior?.outBalance || 0;
        const inCompanyDebt = prior?.outCompanyDebt || 0;
        const inEmployeeDebt = prior?.outEmployeeDebt || 0;

        // Calculate parts totals
        const paymentParts = await this.payrollsService.payrollCompanyPaymentParts(
            payPeriod.companyId,
            payPeriod.dateFrom,
        );
        // Calculate groups totals
        const paymentGroups = await this.payrollsService.payrollCompanyPaymentGroups(
            payPeriod.companyId,
            payPeriod.dateFrom,
        );
        // Calculate Out Balance
        const outBalance =
            inBalance + (paymentParts[PaymentPart.Accruals] || 0) - (paymentParts[PaymentPart.Deductions] || 0);
        const outCompanyDebt = await this.positionsService.calcCompanyDebt(payPeriod.companyId, payPeriod.dateFrom);
        const outEmployeeDebt = await this.positionsService.calcEmployeeDebt(payPeriod.companyId, payPeriod.dateFrom);
        const funds = await this.payFundsService.paySum(payPeriod.companyId, payPeriod.dateFrom);
        const systemUserId = await this.usersService.getSystemUserId();
        await this.payPeriodService.update(systemUserId, payPeriod.id, payPeriod.version, {
            ...payPeriod,
            inBalance,
            inCompanyDebt,
            inEmployeeDebt,
            ...paymentParts,
            ...paymentGroups,
            outBalance,
            outCompanyDebt,
            outEmployeeDebt,
            funds,
        });
        return await this.payPeriodService.findOneBy({ where: { id: payPeriod.id } });
    }

    async updateCalcMethods(id: string): Promise<PayPeriodSummary[]> {
        const payPeriod = await this.payPeriodService.findOneBy({ where: { id } });
        const calculatedRecords = await this.payrollsService.payrollCompanyCalcMethods(
            payPeriod.companyId,
            payPeriod.dateFrom,
        );
        const records = await this.payPeriodsCalcMethodService.findAll({
            where: { payPeriodId: payPeriod.id },
        });
        const toDeleteIds: string[] = records
            .filter((record) => !calculatedRecords.find((o) => o.calcMethod === record.calcMethod))
            .map((o) => o.id);
        if (toDeleteIds.length) {
            await this.payPeriodsCalcMethodService.delete(toDeleteIds);
        }
        for (const calculated of calculatedRecords) {
            const record = records.find((o) => o.calcMethod === calculated.calcMethod) || null;
            if (record) {
                await this.payPeriodsCalcMethodService.update(record.id, {
                    ...calculated,
                    payPeriodId: id,
                });
            } else {
                await this.payPeriodsCalcMethodService.create({
                    ...calculated,
                    payPeriodId: id,
                });
            }
        }
        return this.payPeriodsCalcMethodService.findAll({ where: { payPeriodId: id } });
    }
}
