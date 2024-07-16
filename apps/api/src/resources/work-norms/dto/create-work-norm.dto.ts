import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { WorkNorm } from '../entities/work-norm.entity';

export class CreateWorkNormDto extends IntersectionType(
    PickType(WorkNorm, ['name', 'type']),
    PartialType(
        OmitType(WorkNorm, [
            'id',
            'name',
            'type',
            'periods',
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
