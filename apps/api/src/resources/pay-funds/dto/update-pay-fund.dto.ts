import { PartialType } from '@nestjs/swagger';
import { CreatePayFundDto } from './create-pay-fund.dto';

export class UpdatePayFundDto extends PartialType(CreatePayFundDto) {}
