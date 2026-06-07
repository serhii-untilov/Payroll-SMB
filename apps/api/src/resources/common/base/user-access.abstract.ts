import { ActionContextDto } from '@/resources/user-access/dto/action-context.dto';
// import { UserAccessService } from '@/resources/user-access/user-access.service';
import { Action, Resource } from '@/types';
import { ForbiddenException } from '@nestjs/common';
import { IUserAccessService } from './user-access.interface';

export abstract class BaseUserAccess {
    constructor(
        readonly userAccess: IUserAccessService,
        readonly resource: Resource,
    ) {}

    async requireAccessOrFail(userId: string, action: Action, context?: ActionContextDto): Promise<void> {
        if (!(await this.userAccess.isAllowed({ userId, resource: this.resource, action, context }))) {
            throw new ForbiddenException();
        }
    }
}
