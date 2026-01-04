import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRoleService } from '../user-role';
import { Action, Resource, RoleType } from '@/types';
import { Field } from '@/types/lib/field';
import { UserService } from '../user';

/**
 * User Access Service
 *
 * Naming rule to follow (important)
 * Authorization method names must encode their scope explicitly.
 * Good names answer:
 *  who
 *  what
 *  where (scope)
 * Example:
 *  can - see below
 *  canUserPerformActionOnResourceInScope
 */
@Injectable()
export class AuthService {
    constructor(
        @Inject(forwardRef(() => UserService)) private usersService: UserService,
        @Inject(forwardRef(() => UserRoleService)) private userRoleService: UserRoleService,
    ) {}

    async can(
        userId: string,
        _resource: Resource,
        _action: Action,
        context?: {
            companyId?: string;
            resourceId?: string;
            field?: Field;
        },
    ): Promise<boolean> {
        if (await this.userRoleService.hasGlobalRole(userId, RoleType.SystemAdmin)) {
            return true;
        }
        if (
            context?.companyId &&
            (await this.userRoleService.hasCompanyRole(userId, context.companyId, RoleType.CompanyAdmin))
        ) {
            // TODO: implement proper access checks
            return true;
        }
        // TODO: implement proper access checks
        return true;
    }
}
