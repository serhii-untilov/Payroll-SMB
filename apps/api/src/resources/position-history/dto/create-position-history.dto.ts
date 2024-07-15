import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { PositionHistory } from '../entities/position-history.entity';

export class CreatePositionHistoryDto extends IntersectionType(
    PickType(PositionHistory, ['positionId']),
    PartialType(
        OmitType(PositionHistory, [
            'id',
            'position',
            'department',
            'job',
            'workNorm',
            'paymentType',
            'paymentType',
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
