import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { WorkTimeNorm } from '../entities/work-time-norm.entity';
import { CreateWorkTimeNormDto } from './create-work-time-norm.dto';

export class UpdateWorkTimeNormDto extends IntersectionType(
    PickType(WorkTimeNorm, ['version']),
    PartialType(CreateWorkTimeNormDto),
) {}
