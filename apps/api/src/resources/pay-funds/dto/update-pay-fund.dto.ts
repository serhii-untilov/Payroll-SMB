import { PartialType } from '@nestjs/swagger';
import { CreatePayFundDto } from './create-pay-fund.dto';
import { IUpdatePayFund } from '@repo/shared';

export class UpdatePayFundDto extends PartialType(CreatePayFundDto) implements IUpdatePayFund {}
