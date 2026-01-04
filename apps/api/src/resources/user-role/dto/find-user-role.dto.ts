import { RoleType } from '@/types';

export class FindUserRoleDto {
    userId?: string;
    roleType?: RoleType;
    relations?: boolean = false;
    withDeleted?: boolean = false;
}
