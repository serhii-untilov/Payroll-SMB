import { CreateAccessDto } from './create-access.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAccessDto extends PartialType(CreateAccessDto) {}
