import { PartialType } from '@nestjs/swagger';
import { CreatePositionDto } from './create-position.dto';
import { IUpdatePosition } from '@repo/shared';

export class UpdatePositionDto extends PartialType(CreatePositionDto) implements IUpdatePosition {}
