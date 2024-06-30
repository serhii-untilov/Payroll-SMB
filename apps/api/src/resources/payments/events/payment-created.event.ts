import { Payment } from '../entities/payment.entity';
import { PaymentEvent, PaymentEventType } from './abstract/PaymentEvent';

export class PaymentCreatedEvent extends PaymentEvent {
    constructor(userId: number, payment: Payment) {
        super(PaymentEventType.CREATED, userId, payment);
    }
}
