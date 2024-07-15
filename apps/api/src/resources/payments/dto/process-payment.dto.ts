import { IntersectionType, PickType } from '@nestjs/swagger';
import { Payment } from '../entities/payment.entity';

export class ProcessPaymentDto extends IntersectionType(PickType(Payment, ['version'])) {}
