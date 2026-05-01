import { PartialType } from '@nestjs/swagger';
import { CreatePayFundTypeDto } from './create-pay-fund-type.dto';

export class UpdatePayFundTypeDto extends PartialType(CreatePayFundTypeDto) {}
