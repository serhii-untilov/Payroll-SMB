import { PickType } from '@nestjs/swagger';
import { Access } from '../entities/access.entity';

export class CreateAccessDto extends PickType(Access, ['roleType', 'resourceType', 'accessType']) {}
