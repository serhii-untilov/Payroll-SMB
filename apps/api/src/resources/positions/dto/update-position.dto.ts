import { OmitType, PartialType } from '@nestjs/swagger';
import { Position } from '../entities/position.entity';

export class UpdatePositionDto extends PartialType(
    OmitType(Position, [
        'id',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
