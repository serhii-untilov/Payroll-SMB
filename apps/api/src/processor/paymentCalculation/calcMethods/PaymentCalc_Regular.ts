import { PaymentGroup, PaymentPart, dateUTC } from '@repo/shared';
import { payPeriodFactSum } from 'src/processor/helpers/payroll.helper';
import { PaymentPosition } from '../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalculationService } from '../payment-calculation.service';
import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';
import { getRegularPaymentDate } from './../../helpers/payment.helper';
import { PaymentCalc } from './abstract/PaymentCalc';
import { payFundPayPeriodFactSum } from './../../helpers/payFund.helper';

export class PaymentCalc_Regular extends PaymentCalc {
    constructor(
        ctx: PaymentCalculationService,
        paymentType: PaymentType,
        current: PaymentPosition[],
    ) {
        super(ctx, paymentType, current);
    }

    calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
        paymentPosition.payment.dateFrom = getRegularPaymentDate(this.ctx.payPeriod);
        paymentPosition.payment.dateTo = dateUTC(paymentPosition.payment.dateFrom);
        paymentPosition.baseSum = this.calcBaseSum();
        paymentPosition.deductions = this.calcDeductions();
        paymentPosition.paySum = this.calcPaySum(paymentPosition);
        paymentPosition.funds = this.calcFunds();
        return paymentPosition;
    }

    calcBaseSum(): number {
        const grossPay = this.getGrossPay();
        const { baseSum: currentBaseSum } = this.getTotals(this.current);
        return grossPay - currentBaseSum;
    }

    calcDeductions(): number {
        const deductions = this.getDeductions();
        const { deductions: currentDeductions } = this.getTotals(this.current);
        return deductions - currentDeductions;
    }

    calcFunds(): number {
        const funds = this.getFunds();
        const { funds: currentFunds } = this.getTotals(this.current);
        return funds - currentFunds;
    }

    calcPaySum(paymentPosition: PaymentPosition): number {
        return paymentPosition.baseSum - paymentPosition.deductions;
    }

    getGrossPay(): number {
        return payPeriodFactSum(
            this.ctx.payPeriod,
            this.ctx.payrolls,
            this.getGrossPayPaymentTypeIds(),
        );
    }

    getDeductions(): number {
        return payPeriodFactSum(
            this.ctx.payPeriod,
            this.ctx.payrolls,
            this.getDeductionsPaymentTypeIds(),
        );
    }

    getFunds(): number {
        return payFundPayPeriodFactSum(this.ctx.payPeriod, this.ctx.payFunds);
    }

    getGrossPayPaymentTypeIds(): number[] {
        // TODO: Replace to Entry Table
        return this.ctx.paymentTypes
            .filter((o) => o.paymentPart === PaymentPart.ACCRUALS)
            .map((o) => o.id);
    }

    getDeductionsPaymentTypeIds(): number[] {
        // TODO: Replace to Entry Table
        return this.ctx.paymentTypes
            .filter(
                (o) =>
                    o.paymentPart === PaymentPart.DEDUCTIONS &&
                    o.paymentGroup !== PaymentGroup.PAYMENTS,
            )
            .map((o) => o.id);
    }

    getTotals(paymentPositions: PaymentPosition[]) {
        return paymentPositions
            .filter((o) => o.payment.accPeriod === this.ctx.payPeriod.dateFrom)
            .reduce(
                (a, b) => {
                    a.baseSum += b.baseSum;
                    a.deductions += b.deductions;
                    a.paySum += b.paySum;
                    a.funds += b.funds;
                    return a;
                },
                { baseSum: 0, deductions: 0, paySum: 0, funds: 0 },
            );
    }
}
