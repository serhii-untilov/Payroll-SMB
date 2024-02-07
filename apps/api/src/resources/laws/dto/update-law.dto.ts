import { PartialType } from '@nestjs/mapped-types';
import { CreateLawDto } from './create-law.dto';

export class UpdateLawDto extends PartialType(CreateLawDto) {}
