import { PaymentGroup } from '@repo/shared';
import { PaymentPosition } from '../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalculationService } from '../payment-calculation.service';
import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';
import { payPeriodFactSum } from './../../helpers/payroll.helper';
import { PaymentCalc } from './abstract/PaymentCalc';

export class PaymentCalc_Advance extends PaymentCalc {
    constructor(ctx: PaymentCalculationService, paymentType: PaymentType) {
        super(ctx, paymentType);
    }

    calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
        paymentPosition.baseSum = this.calcBaseSum();
        paymentPosition.paySum = this.calcPaySum(paymentPosition);
        return paymentPosition;
    }

    getPaymentTypeIds(): number[] {
        // TODO: Replace to Entry Table
        const paymentGroups: string[] = [PaymentGroup.BASIC, PaymentGroup.ADJUSTMENTS];
        return this.ctx.paymentTypes
            .filter((o) => paymentGroups.includes(o.paymentGroup))
            .map((o) => o.id);
    }

    calcBaseSum(): number {
        return payPeriodFactSum(this.ctx.payPeriod, this.ctx.payrolls, this.getPaymentTypeIds());
    }

    calcPaySum(paymentPosition: PaymentPosition): number {
        return Math.max(0, Math.trunc(paymentPosition.baseSum * 0.5));
    }
}
