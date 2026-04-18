import {
    CompanyService,
    PayFundsService,
    PayPeriodsService,
    PaymentPositionsService,
    PaymentTypesService,
    PaymentsService,
    PayrollsService,
    PositionsService,
} from '@/resources';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { CalcMethod, PaymentGroup, PaymentStatus } from '@/types';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { dateUTC } from '@repo/shared';
import { CompanyEntity } from '../../resources/company/entities/company.entity';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PayFund } from './../../resources/pay-funds/entities/pay-fund.entity';
import { PayPeriod } from './../../resources/pay-periods/entities/pay-period.entity';
import { PaymentPosition } from './../../resources/payment-positions/entities/paymentPosition.entity';
import { PaymentType } from './../../resources/payment-types/entities/payment-type.entity';
import { Payment } from './../../resources/payments/entities/payment.entity';
import { Payroll } from './../../resources/payrolls/entities/payroll.entity';
import { Position } from './../../resources/positions/entities/position.entity';
import { CalcAdvance, CalcFastPayment, CalcPayment, CalcRegularPayment, PaymentContext } from './calc-methods';

@Injectable({ scope: Scope.REQUEST })
export class PaymentCalculationService {
    logger: Logger = new Logger(PaymentCalculationService.name);
    // userId: string;
    // company: CompanyEntity;
    // paymentTypes: PaymentType[];
    // position: Position;
    // payPeriod: PayPeriod;
    // accPeriods: PayPeriod[];
    // payrolls: Payroll[];
    // payFunds: PayFund[];
    // payments: Payment[];
    // paymentPositions: PaymentPosition[];
    // paymentPositionId: string;

    constructor(
        @Inject(forwardRef(() => CompanyService)) private companiesService: CompanyService,
        @Inject(forwardRef(() => PaymentTypesService)) private paymentTypesService: PaymentTypesService,
        @Inject(forwardRef(() => PayPeriodsService)) private payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => PositionsService)) private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollsService)) private payrollsService: PayrollsService,
        @Inject(forwardRef(() => PayFundsService)) private payFundsService: PayFundsService,
        @Inject(forwardRef(() => PaymentsService)) private paymentsService: PaymentsService,
        @Inject(forwardRef(() => PaymentPositionsService)) private paymentPositionsService: PaymentPositionsService,
        @Inject(forwardRef(() => PayPeriodCalculationService))
        public payPeriodCalculationService: PayPeriodCalculationService,
    ) {}

    private async initContext(userId: string, companyId: string): Promise<PaymentContext> {
        const company = await this.companiesService.findOne(userId, companyId);
        return {
            userId,
            company,
            paymentTypes: await this.paymentTypesService.findAll(),
            payPeriod: await this.payPeriodsService.findOneBy({
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
        const payments = await this.paymentsService.findAll({ companyId, accPeriod: ctx.payPeriod.dateFrom });
        const changedPaymentIds: string[] = [];
        for (const position of positions) {
            changedPaymentIds.push(...(await this._calculatePosition(ctx, position, payments)));
        }
        await this.paymentsService.updateTotals(
            userId,
            changedPaymentIds.filter((id, index, array) => index === array.findIndex((o) => o === id)),
        );
    }

    public async calculatePosition(userId: string, positionId: string) {
        this.logger.log(`userId: ${userId}, calculatePosition: ${positionId}`);
        const position = await this.positionsService.findOne(positionId, { relations: true });
        const ctx = await this.initContext(userId, position.companyId);
        const payments = await this.paymentsService.findAll({
            companyId: ctx.company.id,
            positionId,
            accPeriod: ctx.payPeriod.dateFrom,
        });
        const changedPaymentIds = await this._calculatePosition(ctx, position, payments);
        await this.paymentsService.updateTotals(
            userId,
            changedPaymentIds.filter((id, index, array) => index === array.findIndex((o) => o === id)),
        );
    }

    private async _calculatePosition(ctx: PaymentContext, position: Position, payments: Payment[]): Promise<string[]> {
        const payrolls = await this.getPayrolls(ctx, position);
        const payFunds = await this.getPayFunds();
        const paymentPositions = await this.getPaymentPositions(ctx, position);
        // this.initPaymentPositionId();
        const paymentTypeList = this.paymentTypes.filter((o) => o.paymentGroup === PaymentGroup.Payments);
        const current: PaymentPosition[] = [];
        for (const paymentType of paymentTypeList) {
            // // Pass copy of objects to prevent mutation
            // const calcMethod = this.calcMethodFactory({ ...paymentType }, [...current]);
            const calcMethod = this.calcMethodFactory(paymentType, [...current]);
            if (calcMethod) {
                current.push(calcMethod.calculate());
            }
        }
        const { toInsert, toDelete } = this.merge(current);
        const changedPaymentIds = await this.save(toInsert, toDelete);
        return changedPaymentIds;
    }

    private calcMethodFactory(paymentType: PaymentType, current: PaymentPosition[]): CalcPayment {
        if (paymentType.calcMethod === CalcMethod.RegularPayment) {
            return new CalcRegularPayment(this, paymentType, current);
        } else if (paymentType.calcMethod === CalcMethod.AdvancedPayment) {
            return new CalcAdvance(this, paymentType, current);
        } else if (paymentType.calcMethod === CalcMethod.FastPayment) {
            return new CalcFastPayment(this, paymentType, current);
        }
        throw new Error('Undefined calc method.');
    }

    private async save(toInsert: PaymentPosition[], toDelete: PaymentPosition[]): Promise<string[]> {
        const changedPaymentIds: string[] = [];
        for (const paymentPosition of toDelete) {
            if (paymentPosition?.payment?.id) {
                changedPaymentIds.push(paymentPosition.payment.id);
                await this.paymentPositionsService.delete([paymentPosition.id]);
            }
        }
        for (const { id: _, ...paymentPosition } of toInsert) {
            let payment = payments.find(
                (o) =>
                    o.companyId === this.company.id &&
                    o.accPeriod.getTime() === paymentPosition?.payment?.accPeriod.getTime() &&
                    o.paymentTypeId === paymentPosition?.payment?.paymentTypeId &&
                    o.status === PaymentStatus.Draft,
            );
            if (!payment && paymentPosition?.payment) {
                payment = await this.createPayment(paymentPosition.payment);
                payments.push(payment);
            }
            if (!payment) {
                throw new Error('Payment not defined');
            }
            changedPaymentIds.push(payment.id);
            delete paymentPosition.payment;
            paymentPosition.paymentId = payment.id;
            const created = await this.paymentPositionsService.create(this.userId, paymentPosition);
            this.logger.log(`PositionId: ${this.position.id}, Inserted: ${created.id}`);
        }
        return changedPaymentIds;
    }

    private collapse(paymentPositions: PaymentPosition[]): PaymentPosition[] {
        return paymentPositions.reduce((a, b) => {
            const found = a.find((o) => o?.payment?.paymentTypeId === b?.payment?.paymentTypeId);
            if (found) {
                found.paySum = found.paySum + b.paySum;
            } else {
                a.push(b);
            }
            return a;
        }, [] as PaymentPosition[]);
    }

    private merge(current: PaymentPosition[]): {
        toDelete: PaymentPosition[];
        toInsert: PaymentPosition[];
    } {
        const toDelete: PaymentPosition[] = this.paymentPositions.filter(
            (p) =>
                p?.payment?.status === PaymentStatus.Draft &&
                !current.find(
                    (c) =>
                        c?.payment?.paymentTypeId === p?.payment?.paymentTypeId &&
                        c.baseSum === p.baseSum &&
                        c.deductions === p.deductions &&
                        c.funds === p.funds &&
                        c.paySum === p.paySum,
                ),
        );
        const paymentPositions = this.collapse(
            this.paymentPositions.filter((o) => !toDelete.find((d) => d.id === o.id)),
        );
        const toInsert: PaymentPosition[] = current
            .filter(
                (c) =>
                    !paymentPositions.find(
                        (p) =>
                            p?.payment?.paymentTypeId === c?.payment?.paymentTypeId &&
                            p.baseSum === c.baseSum &&
                            p.deductions === c.deductions &&
                            p.funds === c.funds &&
                            p.paySum === c.paySum,
                    ),
            )
            .map((c) => {
                const found = paymentPositions.find((p) => p?.payment?.paymentTypeId === c?.payment?.paymentTypeId);
                if (found) {
                    c.baseSum = c.baseSum - found.baseSum;
                    c.deductions = c.deductions - found.deductions;
                    c.funds = c.funds - found.funds;
                    c.paySum = c.paySum - found.paySum;
                }
                return c;
            })
            .filter((o) => o.paySum > 0);
        return { toInsert, toDelete };
    }

    private async getPayrolls(ctx: PaymentContext, position: Position): Promise<Payroll[]> {
        return await this.payrollsService.findAll({
            positionId: position.id,
            payPeriod: ctx.payPeriod.dateFrom,
        });
    }

    private async getPayFunds(): Promise<PayFund[]> {
        return await this.payFundsService.findAll({
            positionId: this.position.id,
            payPeriod: this.payPeriod.dateFrom,
        });
    }

    private async getPaymentPositions(ctx: PaymentContext, position: Position): Promise<PaymentPosition[]> {
        return await this.paymentPositionsService.findByPositionId(position.id, ctx.payPeriod.dateFrom);
    }

    private async createPayment(payload: Payment): Promise<Payment> {
        const { id: _, ...payment } = payload;
        payment.docNumber = await this.paymentsService.getNextDocNumber(this.company.id, this.payPeriod.dateFrom);
        payment.docDate = dateUTC(payment.dateFrom);
        return await this.paymentsService.create(this.userId, payment);
    }
}
