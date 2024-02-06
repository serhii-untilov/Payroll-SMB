import { PartialType } from '@nestjs/swagger';
import { CreateLawDto } from './create-law.dto';

export class UpdateLawDto extends PartialType(CreateLawDto) {}
