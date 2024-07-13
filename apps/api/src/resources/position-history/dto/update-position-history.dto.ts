import { OmitType, PartialType } from '@nestjs/swagger';
import { PositionHistory } from '../entities/position-history.entity';

export class UpdatePositionHistoryDto extends PartialType(
    OmitType(PositionHistory, [
        'id',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
