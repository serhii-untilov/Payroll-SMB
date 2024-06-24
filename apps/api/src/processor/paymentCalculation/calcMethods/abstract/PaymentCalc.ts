import { RecordFlags } from '@repo/shared';
import { PaymentPosition } from './../../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalculationService } from './../../payment-calculation.service';

export abstract class PaymentCalc {
    ctx: PaymentCalculationService;

    constructor(ctx: PaymentCalculationService) {
        this.ctx = ctx;
    }

    abstract calculate(): PaymentPosition;

    public makePaymentPosition(): PaymentPosition {
        return Object.assign({
            id: this.ctx.getNextPaymentPositionId(),
            paymentId: 0,
            positionId: this.ctx.position.id,
            baseSum: 0,
            deductions: 0,
            paySum: 0,
            funds: 0,
            recordFlags: RecordFlags.AUTO,
        });
    }
}
