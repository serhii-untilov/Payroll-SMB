import { PayFund } from './../entities/pay-fund.entity';
import { OmitType } from '@nestjs/swagger';
export class CreatePayFundDto extends OmitType(PayFund, ['id', 'position', 'payFundType', 'transform']) {}
