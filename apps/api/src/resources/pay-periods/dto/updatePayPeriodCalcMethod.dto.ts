import { PartialType } from '@nestjs/swagger';
import { IUpdatePayPeriodCalcMethod } from '@repo/shared';
import { CreatePayPeriodCalcMethodDto } from './createPayPeriodCalcMethod.dto';

export class UpdatePayPeriodCalcMethodDto
    extends PartialType(CreatePayPeriodCalcMethodDto)
    implements IUpdatePayPeriodCalcMethod {}
