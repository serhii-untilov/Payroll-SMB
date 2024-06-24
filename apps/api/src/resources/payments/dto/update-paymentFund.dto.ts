import { PartialType } from '@nestjs/swagger';
import { IUpdatePaymentFund } from '@repo/shared';
import { CreatePaymentFundDto } from './create-paymentFund.dto';

export class UpdatePaymentFundDto
    extends PartialType(CreatePaymentFundDto)
    implements IUpdatePaymentFund {}
