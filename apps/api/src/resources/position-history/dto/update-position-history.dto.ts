import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { PositionHistory } from '../entities/position-history.entity';
import { CreatePositionHistoryDto } from './create-position-history.dto';

export class UpdatePositionHistoryDto extends IntersectionType(
    PickType(PositionHistory, ['version']),
    PartialType(CreatePositionHistoryDto),
) {}
