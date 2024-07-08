import { PartialType } from '@nestjs/swagger';
import { IUpdateWorkNormPeriod } from '@repo/shared';
import { CreateWorkNormPeriodDto } from './create-work-norm-period.dto';

export class UpdateWorkNormPeriodDto
    extends PartialType(CreateWorkNormPeriodDto)
    implements IUpdateWorkNormPeriod {}
