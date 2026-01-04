import { UserAccessService } from '@/resources/user-access/user-access.service';
import { Action, Resource } from '@/types';
import { ForbiddenException } from '@nestjs/common';

export abstract class BaseUserAccess {
    constructor(
        readonly userAccess: UserAccessService,
        readonly resource: Resource,
    ) {}

    async canUser(userId: string, action: Action, resourceId?: string): Promise<boolean> {
        return await this.userAccess.canUser({ userId, resource: this.resource, action, context: { resourceId } });
    }

    async canOrFail(userId: string, action: Action, resourceId?: string): Promise<void> {
        if (!(await this.userAccess.canUser({ userId, resource: this.resource, action, context: { resourceId } }))) {
            throw new ForbiddenException();
        }
    }
}
