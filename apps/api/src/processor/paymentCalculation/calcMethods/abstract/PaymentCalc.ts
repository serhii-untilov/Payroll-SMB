import { PaymentStatus, RecordFlags } from '@repo/shared';
import { Payment } from './../../../../resources/payments/entities/payment.entity';
import { PaymentPosition } from './../../../../resources/payments/entities/paymentPosition.entity';
import { PaymentCalculationService } from './../../payment-calculation.service';
import { PaymentType } from './../../../../resources/payment-types/entities/payment-type.entity';

export abstract class PaymentCalc {
    ctx: PaymentCalculationService;
    paymentType: PaymentType;

    constructor(ctx: PaymentCalculationService, paymentType: PaymentType) {
        this.ctx = ctx;
        this.paymentType = paymentType;
    }

    abstract calculate(): PaymentPosition;

    public makePayment(): Payment {
        return Object.assign({
            id: 0,
            companyId: this.ctx.company.id,
            payPeriod: this.ctx.payPeriod.dateFrom,
            accPeriod: this.ctx.payPeriod.dateFrom,
            docNumber: null,
            docDate: null,
            paymentTypeId: this.paymentType.id,
            dateFrom: this.ctx.payPeriod.dateFrom,
            dateTo: this.ctx.payPeriod.dateTo,
            baseSum: 0,
            deductions: 0,
            paySum: 0,
            funds: 0,
            status: PaymentStatus.DRAFT,
            recordFlags: RecordFlags.AUTO,
        });
    }

    public makePaymentPosition(): PaymentPosition {
        return Object.assign({
            id: this.ctx.getNextPaymentPositionId(),
            payment: this.makePayment(),
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
