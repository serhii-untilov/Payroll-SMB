import { PartialType } from '@nestjs/mapped-types';
import { IUpdatePayPeriodCalcMethod } from '@repo/shared';
import { CreatePayPeriodCalcMethodDto } from './createPayPeriodCalcMethod.dto';

export class UpdatePayPeriodCalcMethodDto
    extends PartialType(CreatePayPeriodCalcMethodDto)
    implements IUpdatePayPeriodCalcMethod {}
