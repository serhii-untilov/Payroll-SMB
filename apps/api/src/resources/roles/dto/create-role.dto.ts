import { ICreateRole } from '@repo/shared';

export class CreateRoleDto implements ICreateRole {
    name: string;
    type: string;
}
