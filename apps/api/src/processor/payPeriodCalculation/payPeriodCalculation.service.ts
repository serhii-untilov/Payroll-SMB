import { CompaniesService } from '@/resources/companies/companies.service';
import { Company } from '@/resources/companies/entities/company.entity';
import { PayFundsService } from '@/resources/pay-funds/pay-funds.service';
import { PayPeriod } from '@/resources/pay-periods/entities/pay-period.entity';
import { PayPeriodCalcMethod } from '@/resources/pay-periods/entities/pay-period-calc-method.entity';
import { PayPeriodsService } from '@/resources/pay-periods/pay-periods.service';
import { PayPeriodsCalcMethodService } from '@/resources/pay-periods/pay-periods-calc-method.service';
import { PayrollsService } from '@/resources/payrolls/payrolls.service';
import { PositionsService } from '@/resources/positions/positions.service';
import { UsersService } from '@/resources/users/users.service';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { PaymentPart, PaymentSchedule, dropTime } from '@repo/shared';
import { addYears, endOfYear, startOfYear, sub, subYears } from 'date-fns';
import { PeriodListForEndOfMonthPayment } from './genPeriodMethods/PeriodListForEndOfMonthPayment';
import { PeriodListForEvery15daysPayment } from './genPeriodMethods/PeriodListForEvery15daysPayment';
import { PeriodListGenerator } from './genPeriodMethods/abstract/PeriodListGenerator';

@Injectable({ scope: Scope.REQUEST })
export class PayPeriodCalculationService {
    private _logger: Logger = new Logger(PayPeriodCalculationService.name);
    private _userId: number;
    private _company: Company;
    private _id: number = 0;

    constructor(
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
        @Inject(forwardRef(() => PayPeriodsService))
        private payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => PayPeriodsCalcMethodService))
        private payPeriodsCalcMethodService: PayPeriodsCalcMethodService,
        @Inject(forwardRef(() => PayrollsService))
        private payrollsService: PayrollsService,
        @Inject(forwardRef(() => PayFundsService))
        private payFundsService: PayFundsService,
        @Inject(forwardRef(() => PositionsService))
        private positionsService: PositionsService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
    ) {}

    public get logger() {
        return this._logger;
    }
    public get userId() {
        return this._userId;
    }
    public get company(): Company {
        return this._company;
    }
    public get id() {
        this._id = this._id + 1;
        return this._id;
    }

    private getGenerator(): PeriodListGenerator {
        if (this.company.paymentSchedule === PaymentSchedule.EVERY_15_DAY) {
            return new PeriodListForEvery15daysPayment(this);
        } else if (this.company.paymentSchedule === PaymentSchedule.LAST_DAY) {
            return new PeriodListForEndOfMonthPayment(this);
        } else {
            return new PeriodListForEndOfMonthPayment(this);
        }
    }

    async fillPeriods(userId: number, companyId: number): Promise<void> {
        this._company = await this.companiesService.findOne(userId, companyId);
        this._userId = userId;
        const dateFrom = subYears(startOfYear(this.company.payPeriod), 1);
        const dateTo = addYears(endOfYear(this.company.payPeriod), 1);
        const prior = await this.payPeriodsService.findAll({ companyId, dateFrom, dateTo });
        this._id = prior.reduce((a, b) => (a > b.id ? a : b.id), 0);
        const generator = this.getGenerator();
        const current = generator.getPeriodList(dateFrom, dateTo);
        const { toDelete, toInsert } = this.merge(prior, current);
        this.save(toDelete, toInsert);
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

    async save(toDelete: number[], toInsert: PayPeriod[]) {
        if (toDelete.length) {
            this.payPeriodsService.delete(toDelete);
        }
        for (const { id: _, ...period } of toInsert) {
            this.payPeriodsService.create(this.userId, period);
        }
    }

    async updateBalance(id: number): Promise<PayPeriod> {
        const payPeriod = await this.payPeriodsService.findOneOrFail({ where: { id } });
        // Calculate In Balance
        const prior = await this.payPeriodsService.findOne({
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
            inBalance +
            (paymentParts[PaymentPart.ACCRUALS] || 0) -
            (paymentParts[PaymentPart.DEDUCTIONS] || 0);
        const outCompanyDebt = await this.positionsService.calcCompanyDebt(
            payPeriod.companyId,
            payPeriod.dateFrom,
        );
        const outEmployeeDebt = await this.positionsService.calcEmployeeDebt(
            payPeriod.companyId,
            payPeriod.dateFrom,
        );
        const funds = await this.payFundsService.paySum(payPeriod.companyId, payPeriod.dateFrom);
        const systemUserId = await this.usersService.getSystemUserId();
        return await this.payPeriodsService.update(systemUserId, payPeriod.id, {
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
    }

    async updateCalcMethods(id: number): Promise<PayPeriodCalcMethod[]> {
        const payPeriod = await this.payPeriodsService.findOneOrFail({ where: { id } });
        const calculatedRecords = await this.payrollsService.payrollCompanyCalcMethods(
            payPeriod.companyId,
            payPeriod.dateFrom,
        );
        const records = await this.payPeriodsCalcMethodService.findAll({
            where: { payPeriodId: payPeriod.id },
        });
        const toDeleteIds: number[] = records
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
