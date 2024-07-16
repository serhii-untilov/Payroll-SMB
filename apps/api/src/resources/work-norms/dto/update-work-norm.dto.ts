import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { WorkNorm } from '../entities/work-norm.entity';
import { CreateWorkNormDto } from './create-work-norm.dto';

export class UpdateWorkNormDto extends IntersectionType(
    PickType(WorkNorm, ['version']),
    PartialType(CreateWorkNormDto),
) {}
