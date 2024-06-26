import { dateUTC } from '@repo/shared';
import { PaymentPosition } from '../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalculationService } from '../payment-calculation.service';
import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';
import { getRegularPaymentDate } from './../../helpers/payment.helper';
import { PaymentCalc } from './abstract/PaymentCalc';

export class PaymentCalc_Regular extends PaymentCalc {
    constructor(ctx: PaymentCalculationService, paymentType: PaymentType) {
        super(ctx, paymentType);
    }

    calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
        paymentPosition.payment.dateFrom = getRegularPaymentDate(this.ctx.payPeriod);
        paymentPosition.payment.dateTo = dateUTC(paymentPosition.payment.dateFrom);
        paymentPosition.baseSum = this.calcBaseSum();
        paymentPosition.paySum = this.calcPaySum();
        return paymentPosition;
    }

    calcBaseSum(): number {
        return 0;
    }

    calcPaySum(): number {
        // TODO
        return 300;
    }
}
