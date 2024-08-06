import { PartialType } from '@nestjs/swagger';
import { CreatePaymentFundDto } from './create-payment-fund.dto';

export class UpdatePaymentFundDto extends PartialType(CreatePaymentFundDto) {}
