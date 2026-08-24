import { RoleType } from '@/types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRoleService } from '../user-role/user-role.service';
import { AccessCheckDto } from './dto/access-check.dto';
import { IUserAccessService } from '../common/base/user-access.interface';

/**
 * User Access Service
 *
 * Naming rule to follow (important)
 * Access method names must encode their scope explicitly.
 * Good names answer:
 *  who
 *  what
 *  where (scope)
 * Example:
 *  can - see below
 *  canUserPerformActionOnResourceInScope
 */
@Injectable()
export class UserAccessService implements IUserAccessService {
    constructor(@Inject(forwardRef(() => UserRoleService)) private userRoleService: UserRoleService) {}

    async isAllowed(dto: AccessCheckDto): Promise<boolean> {
        if (await this.userRoleService.hasGlobalRole(dto.userId, RoleType.SystemAdmin)) {
            return true;
        }
        if (
            dto.context?.companyId &&
            (await this.userRoleService.hasCompanyRole(dto.userId, dto.context.companyId, RoleType.CompanyAdmin))
        ) {
            // TODO: implement proper access checks
            return true;
        }
        // TODO: implement proper access checks
        return true;
    }

    canManageRole(current: RoleType, target: RoleType): boolean {
        if (target === RoleType.System) return false;

        const hierarchy: RoleType[] = [
            RoleType.System,
            RoleType.SystemAdmin,
            RoleType.CompanyAdmin,
            RoleType.Accountant,
            RoleType.Manager,
            RoleType.Employee,
        ];

        return hierarchy.indexOf(current) <= hierarchy.indexOf(target);
    }
}
