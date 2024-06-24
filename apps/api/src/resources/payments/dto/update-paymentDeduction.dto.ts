import { PartialType } from '@nestjs/swagger';
import { IUpdatePaymentDeduction } from '@repo/shared';
import { CreatePaymentDeductionDto } from './create-paymentDeduction.dto';

export class UpdatePaymentDeductionDto
    extends PartialType(CreatePaymentDeductionDto)
    implements IUpdatePaymentDeduction {}
