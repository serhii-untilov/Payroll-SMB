import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { PaymentPosition } from './../entities/paymentPosition.entity';
import { CreatePaymentPositionDto } from './create-payment-position.dto';

export class UpdatePaymentPositionDto extends IntersectionType(
    PickType(PaymentPosition, ['version']),
    PartialType(CreatePaymentPositionDto),
) {}
