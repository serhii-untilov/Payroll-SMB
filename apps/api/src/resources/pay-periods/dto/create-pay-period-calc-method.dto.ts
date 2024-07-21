import { OmitType } from '@nestjs/swagger';
import { PayPeriodCalcMethod } from './../entities/pay-period-calc-method.entity';

export class CreatePayPeriodCalcMethodDto extends OmitType(PayPeriodCalcMethod, [
    'id',
    'payPeriod',
    'transform',
]) {}
