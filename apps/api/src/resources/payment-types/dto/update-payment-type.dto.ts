import { IUpdatePaymentType } from '@repo/shared';
import { CreatePaymentTypeDto } from './create-payment-type.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePaymentTypeDto
    extends PartialType(CreatePaymentTypeDto)
    implements IUpdatePaymentType {}
