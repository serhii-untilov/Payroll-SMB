import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDeductionDto } from './create-paymentDeduction.dto';

export class UpdatePaymentDeductionDto extends PartialType(CreatePaymentDeductionDto) {}
