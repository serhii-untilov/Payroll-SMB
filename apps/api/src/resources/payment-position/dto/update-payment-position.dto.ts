import { PartialType } from '@nestjs/swagger';
import { CreatePaymentPositionDto } from './create-payment-position.dto';

export class UpdatePaymentPositionDto extends PartialType(CreatePaymentPositionDto) {}
