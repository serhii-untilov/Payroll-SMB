import { Payment } from './../entities/payment.entity';
import { PaymentEvent, PaymentEventType } from './abstract/payment-event';

export class PaymentDeletedEvent extends PaymentEvent {
    constructor(userId: number, payment: Payment) {
        super(PaymentEventType.DELETED, userId, payment);
    }
}
