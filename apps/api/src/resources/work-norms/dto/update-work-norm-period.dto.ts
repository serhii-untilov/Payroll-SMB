import { PartialType } from '@nestjs/swagger';
import { CreateWorkNormPeriodDto } from './create-work-norm-period.dto';

export class UpdateWorkNormPeriodDto extends PartialType(CreateWorkNormPeriodDto) {}
