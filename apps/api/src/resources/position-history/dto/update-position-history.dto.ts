import { PartialType } from '@nestjs/swagger';
import { CreatePositionHistoryDto } from './create-position-history.dto';

export class UpdatePositionHistoryDto extends PartialType(CreatePositionHistoryDto) {}
