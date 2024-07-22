import { IntersectionType, PickType } from '@nestjs/swagger';
import { Payment } from './../entities/payment.entity';

export class WithdrawPaymentDto extends IntersectionType(PickType(Payment, ['version'])) {}
