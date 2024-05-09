import { PartialType } from '@nestjs/swagger';
import { CreatePositionHistoryDto } from './create-position-history.dto';
import { IUpdatePositionHistory } from '@repo/shared';

export class UpdatePositionHistoryDto
    extends PartialType(CreatePositionHistoryDto)
    implements IUpdatePositionHistory {}
