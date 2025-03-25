import { RoleType } from "@/types";

export class FindUserCompanyByRoleTypeDto {
    roleType: RoleType;
    relations?: boolean = false;
    withDeleted?: boolean = false;
}
