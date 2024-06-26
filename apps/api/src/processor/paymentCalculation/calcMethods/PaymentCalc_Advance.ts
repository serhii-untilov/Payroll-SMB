import { PaymentGroup, dateUTC } from '@repo/shared';
import { PaymentPosition } from '../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalculationService } from '../payment-calculation.service';
import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';
import { payPeriodFactSum } from './../../helpers/payroll.helper';
import { PaymentCalc } from './abstract/PaymentCalc';
import { getAdvancePaymentDate } from './../../helpers/payment.helper';
import { payFundPayPeriodFactSum } from './../../helpers/payFund.helper';

export class PaymentCalc_Advance extends PaymentCalc {
    constructor(ctx: PaymentCalculationService, paymentType: PaymentType) {
        super(ctx, paymentType);
    }

    calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
        paymentPosition.payment.dateFrom = getAdvancePaymentDate(this.ctx.payPeriod);
        paymentPosition.payment.dateTo = dateUTC(paymentPosition.payment.dateFrom);
        paymentPosition.baseSum = this.calcBaseSum();
        paymentPosition.deductions = this.calcDeductions();
        paymentPosition.funds = this.calcFunds();
        paymentPosition.paySum = this.calcPaySum(paymentPosition);
        return paymentPosition;
    }

    getBaseSumPaymentTypeIds(): number[] {
        // TODO: Replace to Entry Table
        const paymentGroups: string[] = [PaymentGroup.BASIC, PaymentGroup.ADJUSTMENTS];
        return this.ctx.paymentTypes
            .filter((o) => paymentGroups.includes(o.paymentGroup))
            .map((o) => o.id);
    }

    getDeductionsPaymentTypeIds(): number[] {
        // TODO: Replace to Entry Table
        const paymentGroups: string[] = [PaymentGroup.TAXES];
        return this.ctx.paymentTypes
            .filter((o) => paymentGroups.includes(o.paymentGroup))
            .map((o) => o.id);
    }

    calcBaseSum(): number {
        const factSum = payPeriodFactSum(
            this.ctx.payPeriod,
            this.ctx.payrolls,
            this.getBaseSumPaymentTypeIds(),
        );
        return Math.max(0, Math.trunc(factSum * 0.5));
    }

    calcDeductions(): number {
        const factSum = payPeriodFactSum(
            this.ctx.payPeriod,
            this.ctx.payrolls,
            this.getDeductionsPaymentTypeIds(),
        );
        return Math.max(0, Math.trunc(factSum * 0.5));
    }

    calcFunds(): number {
        const funds = payFundPayPeriodFactSum(this.ctx.payPeriod, this.ctx.payFunds);
        return Math.max(0, Math.trunc(funds * 0.5));
    }

    calcPaySum(paymentPosition: PaymentPosition): number {
        return paymentPosition.baseSum - paymentPosition.deductions;
    }
}
