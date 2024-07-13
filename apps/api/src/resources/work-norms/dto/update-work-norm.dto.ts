import { OmitType, PartialType } from '@nestjs/swagger';
import { WorkNorm } from '../entities/work-norm.entity';

export class UpdateWorkNormDto extends PartialType(
    OmitType(WorkNorm, [
        'id',
        'periods',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
