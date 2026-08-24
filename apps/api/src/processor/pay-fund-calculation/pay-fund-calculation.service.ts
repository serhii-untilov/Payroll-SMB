import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { PayFundCalcMethod } from '@/types';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PayFundType } from './../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from './../../resources/pay-fund/entities/pay-fund.entity';
import { PayPeriod } from './../../resources/pay-period/entities/pay-period.entity';
import { Position } from './../../resources/positions/entities/position.entity';
import { Context, PayFundCalc } from './calc-methods/base/pay-fund-calc';
import { EcbMinWage } from './calc-methods/lib/ecb-min-wage';
import { EcbSalary } from './calc-methods/lib/ecb-salary';
import { CompanyService } from '../../resources/company/company.service';
import { MinWageService } from '../../resources/min-wage/min-wage.service';
import { PayFundTypesService } from '../../resources/pay-fund-types/pay-fund-types.service';
import { PayFundService } from '../../resources/pay-fund/pay-fund.service';
import { PayPeriodService } from '../../resources/pay-period/pay-period.service';
import { PaymentTypeService } from '../../resources/payment-type/payment-type.service';
import { PayrollsService } from '../../resources/payrolls/payrolls.service';
import { PositionsService } from '../../resources/positions/positions.service';

@Injectable({ scope: Scope.REQUEST })
export class PayFundCalculationService {
    private readonly logger: Logger = new Logger(PayFundCalculationService.name);

    constructor(
        @Inject(forwardRef(() => CompanyService)) private companiesService: CompanyService,
        @Inject(forwardRef(() => PaymentTypeService)) private paymentTypeService: PaymentTypeService,
        @Inject(forwardRef(() => PayFundTypesService)) private payFundTypesService: PayFundTypesService,
        @Inject(forwardRef(() => PayPeriodService)) private payPeriodService: PayPeriodService,
        @Inject(forwardRef(() => PositionsService)) private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollsService)) private payrollsService: PayrollsService,
        @Inject(forwardRef(() => PayFundService)) private payFundsService: PayFundService,
        @Inject(forwardRef(() => MinWageService)) public minWageService: MinWageService,
        @Inject(forwardRef(() => PayPeriodCalculationService))
        public payPeriodCalculationService: PayPeriodCalculationService,
    ) {}

    private async initContext(userId: string, companyId: string): Promise<Context> {
        const company = await this.companiesService.findOne(userId, companyId);
        return {
            userId,
            company,
            paymentTypes: await this.paymentTypeService.findAll(),
            payFundTypes: (await this.payFundTypesService.findAll()).sort((a, b) => a.sequence - b.sequence),
            minWages: await this.minWageService.findAll(),
            payPeriod: await this.payPeriodService.findOneBy({
                where: { companyId: company.id, dateFrom: company.payPeriod },
            }),
        };
    }

    public async calculateCompany(userId: string, companyId: string) {
        this.logger.log(`userId: ${userId}, calculateCompany: ${companyId}`);
        const ctx = await this.initContext(userId, companyId);
        const positions = await this.positionsService.findAll({
            companyId,
            onPayPeriodDate: ctx.company.payPeriod,
            employeesOnly: true,
            relations: true,
        });
        for (const position of positions) {
            await this._calculatePosition(ctx, position);
        }
        await this._calculateCompanyTotals(ctx);
    }

    public async calculatePosition(userId: string, positionId: string) {
        this.logger.log(`userId: ${userId}, calculatePosition: ${positionId}`);
        const position = await this.positionsService.findOne(positionId, { relations: true });
        const ctx = await this.initContext(userId, position.companyId);
        await this._calculatePosition(ctx, position);
        await this._calculateCompanyTotals(ctx);
    }

    public async calculateCompanyTotals(userId: string, companyId: string) {
        this.logger.log(`userId: ${userId}, calculateCompanyTotals: ${companyId}`);
        const ctx = await this.initContext(userId, companyId);
        await this._calculateCompanyTotals(ctx);
    }

    private async _calculateCompanyTotals(ctx: Context) {
        await this.payPeriodCalculationService.updateBalance(ctx.payPeriod.id);
        await this.payPeriodCalculationService.updateCalcMethods(ctx.payPeriod.id);
    }

    private merge(
        ctx: Context,
        accPeriod: PayPeriod,
        currentPayFunds: PayFund[],
        priorPayFunds: PayFund[],
    ): { toInsert: PayFund[]; toDeleteIds: string[] } {
        const toInsert: PayFund[] = [];
        const toDeleteIds: string[] = [];
        const processedIds: string[] = [];
        // Sub prior from current
        priorPayFunds
            .filter(
                (o) =>
                    o.accPeriod.getTime() >= accPeriod.dateFrom.getTime() &&
                    o.accPeriod.getTime() <= accPeriod.dateTo.getTime() &&
                    o.payPeriod.getTime() <= ctx.payPeriod.dateTo.getTime(),
            )
            .forEach((prior) => {
                const current = currentPayFunds.find(
                    (record) =>
                        record.accPeriod.getTime() === prior.accPeriod.getTime() &&
                        record.payFundTypeId === prior.payFundTypeId &&
                        record.payFundCategory === prior.payFundCategory &&
                        !processedIds.includes(record.id),
                );
                if (current) {
                    if (current.paySum === prior.paySum) {
                        processedIds.push(current.id);
                    } else {
                        if (prior.payPeriod.getTime() === ctx.payPeriod.dateFrom.getTime()) {
                            toDeleteIds.push(prior.id);
                        } else {
                            toInsert.push(
                                Object.assign({
                                    ...prior,
                                    id: null,
                                    incomeSum: -prior.incomeSum,
                                    baseSum: -prior.baseSum,
                                    paySum: -prior.paySum,
                                }),
                            );
                        }
                    }
                } else {
                    if (prior.payPeriod.getTime() < ctx.payPeriod.dateFrom.getTime()) {
                        toInsert.push(
                            Object.assign({
                                ...prior,
                                id: null,
                                incomeSum: -prior.incomeSum,
                                baseSum: -prior.baseSum,
                                paySum: -prior.paySum,
                            }),
                        );
                    } else {
                        toDeleteIds.push(prior.id);
                    }
                }
            });
        // Push to insert if paySum not equal 0
        toInsert.push(
            ...currentPayFunds
                .filter((o) => o.paySum && !processedIds.includes(o.id))
                .reduce((a, b) => {
                    a.push(b);
                    return a;
                }, [] as PayFund[]),
        );
        return { toInsert, toDeleteIds };
    }

    // private initNextPayFundId() {
    //     this.payFundId = this.priorPayFunds.reduce((a, b) => Math.max(a, b.id), 0);
    //     return this.payFundId
    // }

    private getCalcMethod(
        ctx: Context,
        position: Position,
        payrolls: Payroll[],
        accPeriod: PayPeriod,
        payFundType: PayFundType,
        current: PayFund[],
    ): PayFundCalc | null {
        if (payFundType.calcMethod === PayFundCalcMethod.EcbSalary) {
            return new EcbSalary(ctx, position, payrolls, accPeriod, payFundType, current);
        } else if (payFundType.calcMethod === PayFundCalcMethod.EcbMinWage) {
            return new EcbMinWage(ctx, position, payrolls, accPeriod, payFundType, current);
        }
        // throw new Error(`Bad PayFund calc method ${payFundType.calcMethod}.`);
        return null;
    }

    private async _calculatePosition(ctx: Context, position: Position) {
        const dateFrom = await this.getMinCalculateDate(ctx.payPeriod.dateFrom);
        const dateTo = await this.getMaxCalculateDate(ctx.payPeriod.dateTo);
        const accPeriods = await this.payPeriodService.findAll({
            companyId: ctx.company.id,
            dateFrom,
            dateTo,
        });
        const payrolls = await this.payrollsService.findBetween(position.id, dateFrom, dateTo, true);
        const priorPayFunds = await this.payFundsService.findBetween(position.id, dateFrom, dateTo, true);
        // this.initNextPayFundId();
        for (const accPeriod of accPeriods) {
            const currentPayFunds: PayFund[] = [];
            ctx.payFundTypes.forEach((payFundType) => {
                const calcMethod = this.getCalcMethod(ctx, position, payrolls, accPeriod, payFundType, currentPayFunds);
                if (calcMethod) {
                    const payFund = calcMethod.calculate();
                    currentPayFunds.push(payFund);
                }
            });
            const { toInsert, toDeleteIds } = this.merge(ctx, accPeriod, currentPayFunds, priorPayFunds);
            await this.save(ctx.userId, toInsert, toDeleteIds);
        }
        // await this.positionsService.calculateBalance(this.position.id, this.payPeriod.dateFrom);
    }

    private async getMinCalculateDate(payPeriodDateFrom: Date): Promise<Date> {
        // TODO
        return payPeriodDateFrom;
    }

    private async getMaxCalculateDate(payPeriodDateTo: Date): Promise<Date> {
        // TODO
        return payPeriodDateTo;
    }

    private async save(userId: string, toInsert: PayFund[], toDeleteIds: string[]) {
        if (toDeleteIds.length) {
            await this.payFundsService.delete(toDeleteIds);
        }
        for (const record of toInsert) {
            const { id: _, ...payload } = record;
            await this.payFundsService.create(userId, payload);
        }
    }
}
