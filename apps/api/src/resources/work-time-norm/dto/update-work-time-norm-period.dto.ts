import { PartialType } from '@nestjs/swagger';
import { CreateWorkTimeNormPeriodDto } from './create-work-time-norm-period.dto';

export class UpdateWorkTimeNormPeriodDto extends PartialType(CreateWorkTimeNormPeriodDto) {}
