import { PartialType } from '@nestjs/swagger';
import { CreatePayPeriodCalcMethodDto } from './createPayPeriodCalcMethod.dto';

export class UpdatePayPeriodCalcMethodDto extends PartialType(CreatePayPeriodCalcMethodDto) {}
