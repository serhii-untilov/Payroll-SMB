import { PartialType } from '@nestjs/swagger';
import { CreateLawDto } from './create-law.dto';
import { IUpdateLaw } from '@repo/shared';

export class UpdateLawDto extends PartialType(CreateLawDto) implements IUpdateLaw {}
