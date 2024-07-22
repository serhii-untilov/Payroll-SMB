import {
    getRegularPaymentDate,
    getTotals,
    payFundPayPeriodFactSum,
    payPeriodFactSum,
} from '@/processor/helpers';
import { PaymentGroup, PaymentPart } from '@/types';
import { dateUTC } from '@repo/shared';
import { PaymentCalculationService } from '../../payment-calculation.service';
import { CalcPayment } from '../abstract/calc-payment';
import { PaymentPosition } from './../../../../resources/payment-positions/entities/paymentPosition.entity';
import { PaymentType } from './../../../../resources/payment-types/entities/payment-type.entity';

export class CalcRegularPayment extends CalcPayment {
    constructor(
        ctx: PaymentCalculationService,
        paymentType: PaymentType,
        current: PaymentPosition[],
    ) {
        super(ctx, paymentType, current);
    }

    public calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
        paymentPosition.payment = this.makePayment();
        paymentPosition.payment.dateFrom = getRegularPaymentDate(this.ctx.payPeriod);
        paymentPosition.payment.dateTo = dateUTC(paymentPosition.payment.dateFrom);
        paymentPosition.baseSum = this.calcBaseSum();
        paymentPosition.deductions = this.calcDeductions();
        paymentPosition.paySum = this.calcPaySum(paymentPosition);
        paymentPosition.funds = this.calcFunds();
        return paymentPosition;
    }

    private calcBaseSum(): number {
        const grossPay = this.getGrossPay();
        const { baseSum: currentBaseSum } = getTotals(this.current, this.ctx.payPeriod.dateFrom);
        return grossPay - currentBaseSum;
    }

    private calcDeductions(): number {
        const deductions = this.getDeductions();
        const { deductions: currentDeductions } = getTotals(
            this.current,
            this.ctx.payPeriod.dateFrom,
        );
        return deductions - currentDeductions;
    }

    private calcFunds(): number {
        const funds = this.getFunds();
        const { funds: currentFunds } = getTotals(this.current, this.ctx.payPeriod.dateFrom);
        return funds - currentFunds;
    }

    private calcPaySum(paymentPosition: PaymentPosition): number {
        return paymentPosition.baseSum - paymentPosition.deductions;
    }

    private getGrossPay(): number {
        return payPeriodFactSum(
            this.ctx.payPeriod,
            this.ctx.payrolls,
            this.getGrossPayPaymentTypeIds(),
        );
    }

    private getDeductions(): number {
        return payPeriodFactSum(
            this.ctx.payPeriod,
            this.ctx.payrolls,
            this.getDeductionsPaymentTypeIds(),
        );
    }

    private getFunds(): number {
        return payFundPayPeriodFactSum(this.ctx.payPeriod, this.ctx.payFunds);
    }

    private getGrossPayPaymentTypeIds(): number[] {
        // TODO: Replace to Entry Table
        return this.ctx.paymentTypes
            .filter((o) => o.paymentPart === PaymentPart.Accruals)
            .map((o) => o.id);
    }

    private getDeductionsPaymentTypeIds(): number[] {
        // TODO: Replace to Entry Table
        return this.ctx.paymentTypes
            .filter(
                (o) =>
                    o.paymentPart === PaymentPart.Deductions &&
                    o.paymentGroup !== PaymentGroup.Payments,
            )
            .map((o) => o.id);
    }
}
