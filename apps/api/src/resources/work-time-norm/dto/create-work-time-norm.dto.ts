import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { WorkTimeNorm } from '../entities/work-time-norm.entity';

export class CreateWorkTimeNormDto extends IntersectionType(
    PickType(WorkTimeNorm, ['name', 'type']),
    PartialType(
        OmitType(WorkTimeNorm, [
            'id',
            'name',
            'type',
            'days',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
            'version',
        ]),
    ),
) {}
