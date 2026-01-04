import { RoleType } from '@/types';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRoleService } from '../user-role';
import { CanUserDto } from './dto/can-user.dto';

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
export class UserAccessService {
    constructor(@Inject(forwardRef(() => UserRoleService)) private userRoleService: UserRoleService) {}

    async canUser(dto: CanUserDto): Promise<boolean> {
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
}
