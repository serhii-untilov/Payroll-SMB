import { OmitType, PartialType } from '@nestjs/swagger';
import { IUpdateAccess } from '@repo/shared';
import { Access } from '../entities/access.entity';

export class UpdateAccessDto
    extends PartialType(OmitType(Access, ['id']))
    implements IUpdateAccess {}
