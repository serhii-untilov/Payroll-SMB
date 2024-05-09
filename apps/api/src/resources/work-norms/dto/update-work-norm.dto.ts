import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkNormDto } from './create-work-norm.dto';
import { IUpdateWorkNorm } from '@repo/shared';

export class UpdateWorkNormDto extends PartialType(CreateWorkNormDto) implements IUpdateWorkNorm {}
