import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Position } from '../entities/position.entity';

export class CreatePositionDto extends IntersectionType(
    PickType(Position, ['companyId']),
    PartialType(
        OmitType(Position, [
            'id',
            'company',
            'companyId',
            'person',
            'history',
            'balance',
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
