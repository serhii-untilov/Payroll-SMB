import { PartialType } from '@nestjs/mapped-types';
import { IUpdatePayPeriod } from '@repo/shared';
import { CreatePayPeriodDto } from './create-pay-period.dto';

export class UpdatePayPeriodDto
    extends PartialType(CreatePayPeriodDto)
    implements IUpdatePayPeriod {}
