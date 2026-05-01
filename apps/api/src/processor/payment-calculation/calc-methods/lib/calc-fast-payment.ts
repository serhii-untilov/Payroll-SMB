import { Position } from '@/resources/positions/entities';
import { PaymentType } from './../../../../resources/payment-type/entities/payment-type.entity';
import { PaymentPosition } from './../../../../resources/payment-positions/entities/paymentPosition.entity';
import { CalcPayment, PaymentContext } from '../base/calc-payment.abstract';

export class CalcFastPayment extends CalcPayment {
    constructor(ctx: PaymentContext, position: Position, paymentType: PaymentType, current: PaymentPosition[]) {
        super(ctx, position, paymentType, current);
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
