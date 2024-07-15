import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Position } from '../entities/position.entity';
import { CreatePositionDto } from './create-position.dto';

export class UpdatePositionDto extends IntersectionType(
    PickType(Position, ['version']),
    PartialType(CreatePositionDto),
) {}
