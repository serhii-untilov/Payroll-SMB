import { PaymentType } from './../../../../resources/payment-types/entities/payment-type.entity';
import { PaymentPosition } from './../../../../resources/payment-positions/entities/paymentPosition.entity';
import { PaymentCalculationService } from '../../payment-calculation.service';
import { CalcPayment } from '../abstract/calc-payment';

export class CalcFastPayment extends CalcPayment {
    constructor(ctx: PaymentCalculationService, paymentType: PaymentType, current: PaymentPosition[]) {
        super(ctx, paymentType, current);
    }

    public calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
        // TODO
        // paymentPosition.payment.dateFrom = null;
        // paymentPosition.payment.dateTo = null;
        paymentPosition.baseSum = this.calcBaseSum();
        paymentPosition.paySum = this.calcPaySum();
        return paymentPosition;
    }

    private calcBaseSum(): number {
        return 0;
    }

    private calcPaySum(): number {
        // TODO
        return 0;
    }
}
