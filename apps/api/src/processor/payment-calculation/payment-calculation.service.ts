import { CalcMethod, PaymentGroup, PaymentStatus } from '@/types';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { dateUTC } from '@repo/shared';
import { PayPeriodCalculationService } from '../pay-period-calculation/pay-period-calculation.service';
import { PayFund } from './../../resources/pay-fund/entities/pay-fund.entity';
import { PaymentPosition } from './../../resources/payment-position/entities/paymentPosition.entity';
import { PaymentType } from './../../resources/payment-type/entities/payment-type.entity';
import { Payment } from './../../resources/payments/entities/payment.entity';
import { Payroll } from './../../resources/payrolls/entities/payroll.entity';
import { Position } from './../../resources/positions/entities/position.entity';
import { PaymentContext } from './calc-methods/base/calc-payment.abstract';
import { CalcAdvance } from './calc-methods/lib/calc-advance';
import { CalcFastPayment } from './calc-methods/lib/calc-fast-payment';
import { CalcPayment } from './calc-methods/base/calc-payment.abstract';
import { CalcRegularPayment } from './calc-methods/lib/calc-regular-payment';
import { CompanyService } from '../../resources/company/company.service';
import { PayFundService } from '../../resources/pay-fund/pay-fund.service';
import { PayPeriodService } from '../../resources/pay-period/pay-period.service';
import { PaymentPositionService } from '../../resources/payment-position/payment-position.service';
import { PaymentTypeService } from '../../resources/payment-type/payment-type.service';
import { PaymentsService } from '../../resources/payments/payments.service';
import { PayrollsService } from '../../resources/payrolls/payrolls.service';
import { PositionsService } from '../../resources/positions/positions.service';

@Injectable({ scope: Scope.REQUEST })
export class PaymentCalculationService {
    private readonly logger: Logger = new Logger(PaymentCalculationService.name);
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
        @Inject(forwardRef(() => PaymentTypeService)) private paymentTypeService: PaymentTypeService,
        @Inject(forwardRef(() => PayPeriodService)) private payPeriodService: PayPeriodService,
        @Inject(forwardRef(() => PositionsService)) private positionsService: PositionsService,
        @Inject(forwardRef(() => PayrollsService)) private payrollsService: PayrollsService,
        @Inject(forwardRef(() => PayFundService)) private payFundsService: PayFundService,
        @Inject(forwardRef(() => PaymentsService)) private paymentsService: PaymentsService,
        @Inject(forwardRef(() => PaymentPositionService)) private paymentPositionsService: PaymentPositionService,
        @Inject(forwardRef(() => PayPeriodCalculationService))
        public payPeriodCalculationService: PayPeriodCalculationService,
    ) {}

    private async initContext(userId: string, companyId: string): Promise<PaymentContext> {
        const company = await this.companiesService.findOne(userId, companyId);
        return {
            userId,
            company,
            paymentTypes: await this.paymentTypeService.findAll(),
            payrolls: [],
            payFunds: [],
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
        const payFunds = await this.getPayFunds(ctx, position);
        ctx.payrolls = payrolls;
        ctx.payFunds = payFunds;
        const paymentPositions = await this.getPaymentPositions(ctx, position);
        const paymentTypeList = ctx.paymentTypes.filter((o) => o.paymentGroup === PaymentGroup.Payments);
        const current: PaymentPosition[] = [];
        for (const paymentType of paymentTypeList) {
            const calcMethod = this.calcMethodFactory(ctx, position, paymentType, [...current]);
            if (calcMethod) {
                current.push(calcMethod.calculate());
            }
        }
        const { toInsert, toDelete } = this.merge(current, paymentPositions);
        const changedPaymentIds = await this.save(toInsert, toDelete, payments, ctx, position);
        return changedPaymentIds;
    }

    private calcMethodFactory(
        ctx: PaymentContext,
        position: Position,
        paymentType: PaymentType,
        current: PaymentPosition[],
    ): CalcPayment | undefined {
        if (paymentType.calcMethod === CalcMethod.RegularPayment) {
            return new CalcRegularPayment(ctx, position, paymentType, current);
        } else if (paymentType.calcMethod === CalcMethod.AdvancedPayment) {
            return new CalcAdvance(ctx, position, paymentType, current);
        } else if (paymentType.calcMethod === CalcMethod.FastPayment) {
            return new CalcFastPayment(ctx, position, paymentType, current);
        }
        throw new Error('Undefined calc method.');
    }

    private async save(
        toInsert: PaymentPosition[],
        toDelete: PaymentPosition[],
        payments: Payment[],
        ctx: PaymentContext,
        position: Position,
    ): Promise<string[]> {
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
                    o.companyId === ctx.company.id &&
                    o.accPeriod.getTime() === paymentPosition?.payment?.accPeriod.getTime() &&
                    o.paymentTypeId === paymentPosition?.payment?.paymentTypeId &&
                    o.status === PaymentStatus.Draft,
            );
            if (!payment && paymentPosition?.payment) {
                payment = await this.createPayment(paymentPosition.payment, ctx);
                payments.push(payment);
            }
            if (!payment) {
                throw new Error('Payment not defined');
            }
            changedPaymentIds.push(payment.id);
            delete paymentPosition.payment;
            paymentPosition.paymentId = payment.id;
            const created = await this.paymentPositionsService.create(ctx.userId, paymentPosition);
            this.logger.log(`PositionId: ${position.id}, Inserted: ${created.id}`);
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

    private merge(
        current: PaymentPosition[],
        paymentPositions: PaymentPosition[],
    ): {
        toDelete: PaymentPosition[];
        toInsert: PaymentPosition[];
    } {
        const toDelete: PaymentPosition[] = paymentPositions.filter(
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
        const paymentPositionsCollapsed = this.collapse(
            paymentPositions.filter((o) => !toDelete.find((d) => d.id === o.id)),
        );
        const toInsert: PaymentPosition[] = current
            .filter(
                (c) =>
                    !paymentPositionsCollapsed.find(
                        (p) =>
                            p?.payment?.paymentTypeId === c?.payment?.paymentTypeId &&
                            p.baseSum === c.baseSum &&
                            p.deductions === c.deductions &&
                            p.funds === c.funds &&
                            p.paySum === c.paySum,
                    ),
            )
            .map((c) => {
                const found = paymentPositionsCollapsed.find(
                    (p) => p?.payment?.paymentTypeId === c?.payment?.paymentTypeId,
                );
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

    private async getPayFunds(ctx: PaymentContext, position: Position): Promise<PayFund[]> {
        return await this.payFundsService.findAll({
            positionId: position.id,
            payPeriod: ctx.payPeriod.dateFrom,
        });
    }

    private async getPaymentPositions(ctx: PaymentContext, position: Position): Promise<PaymentPosition[]> {
        return await this.paymentPositionsService.findByPositionId(position.id, ctx.payPeriod.dateFrom);
    }

    private async createPayment(payload: Payment, ctx: PaymentContext): Promise<Payment> {
        const { id: _, ...payment } = payload;
        payment.docNumber = await this.paymentsService.getNextDocNumber(ctx.company.id, ctx.payPeriod.dateFrom);
        payment.docDate = dateUTC(payment.dateFrom);
        return await this.paymentsService.create(ctx.userId, payment);
    }
}
