import { PartialType } from '@nestjs/swagger';
import { CreatePaymentFundDto } from './create-paymentFund.dto';

export class UpdatePaymentFundDto extends PartialType(CreatePaymentFundDto) {}
