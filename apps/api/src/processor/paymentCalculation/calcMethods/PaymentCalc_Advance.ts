import { PaymentPosition } from '../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalculationService } from '../payment-calculation.service';
import { PaymentCalc } from './abstract/PaymentCalc';

export class PaymentCalc_Advance extends PaymentCalc {
    constructor(ctx: PaymentCalculationService) {
        super(ctx);
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
        return 200;
    }
}