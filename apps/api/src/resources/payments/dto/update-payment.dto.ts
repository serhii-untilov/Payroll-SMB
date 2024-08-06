import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Payment } from './../entities/payment.entity';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends IntersectionType(
    PickType(Payment, ['version']),
    PartialType(CreatePaymentDto),
) {}
