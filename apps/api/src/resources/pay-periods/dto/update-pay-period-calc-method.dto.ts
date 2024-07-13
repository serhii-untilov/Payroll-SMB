import { PartialType } from '@nestjs/swagger';
import { CreatePayPeriodCalcMethodDto } from './create-pay-period-calc-method.dto';

export class UpdatePayPeriodCalcMethodDto extends PartialType(CreatePayPeriodCalcMethodDto) {}
