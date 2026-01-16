import { ActionContextDto } from '@/resources/user-access/dto/action-context.dto';
import { UserAccessService } from '@/resources/user-access/user-access.service';
import { Action, Resource } from '@/types';
import { ForbiddenException } from '@nestjs/common';

export abstract class BaseUserAccess {
    constructor(
        readonly userAccess: UserAccessService,
        readonly resource: Resource,
    ) {}

    async canOrFail(userId: string, action: Action, context?: ActionContextDto): Promise<void> {
        if (!(await this.userAccess.canUser({ userId, resource: this.resource, action, context }))) {
            throw new ForbiddenException();
        }
    }
}
