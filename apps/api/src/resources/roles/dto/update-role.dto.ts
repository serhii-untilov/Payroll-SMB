import { PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IUpdateRole } from '@repo/shared';

export class UpdateRoleDto extends PartialType(CreateRoleDto) implements IUpdateRole {}
