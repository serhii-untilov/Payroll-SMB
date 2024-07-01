import { Payment } from '../entities/payment.entity';
import { PaymentEvent, PaymentEventType } from './abstract/PaymentEvent';

export class PaymentUpdatedEvent extends PaymentEvent {
    constructor(userId: number, payment: Payment) {
        super(PaymentEventType.UPDATED, userId, payment);
    }
}
