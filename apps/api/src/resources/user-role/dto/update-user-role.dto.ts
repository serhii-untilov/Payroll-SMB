import { OmitType, PartialType } from '@nestjs/swagger';
import { UserRole } from '../entities/user-role.entity';

export class UpdateUserRoleDto extends PartialType(OmitType(UserRole, ['id'])) {}
