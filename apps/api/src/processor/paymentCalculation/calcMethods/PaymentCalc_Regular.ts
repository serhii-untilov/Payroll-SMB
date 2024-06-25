import { PaymentCalculationService } from '../payment-calculation.service';
import { PaymentPosition } from '../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalc } from './abstract/PaymentCalc';
import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';

export class PaymentCalc_Regular extends PaymentCalc {
    constructor(ctx: PaymentCalculationService, paymentType: PaymentType) {
        super(ctx, paymentType);
    }

    calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
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
