import { OmitType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { Access } from '../entities/access.entity';

export class UpdateAccessDto extends PartialType(OmitType(Access, ['id'])) {}
