import { OmitType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { IUpdatePosition } from '@repo/shared';
import { Position } from '../entities/position.entity';

export class UpdatePositionDto
    extends PartialType(
        OmitType(Position, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdatePosition {}
