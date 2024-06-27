import { PaymentGroup, PaymentPart, dateUTC } from '@repo/shared';
import { payPeriodFactSum } from 'src/processor/helpers/payroll.helper';
import { PaymentPosition } from '../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalculationService } from '../payment-calculation.service';
import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';
import { payFundPayPeriodFactSum } from './../../helpers/payFund.helper';
import { getRegularPaymentDate, getTotals } from './../../helpers/payment.helper';
import { PaymentCalc } from './abstract/PaymentCalc';

export class PaymentCalc_Regular extends PaymentCalc {
    constructor(
        ctx: PaymentCalculationService,
        paymentType: PaymentType,
        current: PaymentPosition[],
    ) {
        super(ctx, paymentType, current);
    }

    public calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
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
        const { baseSum: currentBaseSum } = getTotals(this.current);
        return grossPay - currentBaseSum;
    }

    private calcDeductions(): number {
        const deductions = this.getDeductions();
        const { deductions: currentDeductions } = getTotals(this.current);
        return deductions - currentDeductions;
    }

    private calcFunds(): number {
        const funds = this.getFunds();
        const { funds: currentFunds } = getTotals(this.current);
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
            .filter((o) => o.paymentPart === PaymentPart.ACCRUALS)
            .map((o) => o.id);
    }

    private getDeductionsPaymentTypeIds(): number[] {
        // TODO: Replace to Entry Table
        return this.ctx.paymentTypes
            .filter(
                (o) =>
                    o.paymentPart === PaymentPart.DEDUCTIONS &&
                    o.paymentGroup !== PaymentGroup.PAYMENTS,
            )
            .map((o) => o.id);
    }
}
