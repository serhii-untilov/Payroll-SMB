import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDeductionDto } from './create-payment-deduction.dto';

export class UpdatePaymentDeductionDto extends PartialType(CreatePaymentDeductionDto) {}
