import { QueryPolicy } from '@/resources/common/policy/query-policy.interface';
import { Action, Resource } from '@/types';
import { Injectable } from '@nestjs/common';
import { UserAccessService } from '@/resources/user-access/user-access.service';

@Injectable()
export class ListPersonsPolicy implements QueryPolicy<any> {
    constructor(private readonly userAccess: UserAccessService) {}

    async canExecute(query: any): Promise<boolean> {
        return await this.userAccess.canUser({
            userId: query.userId,
            resource: Resource.Person,
            action: Action.Read,
        });
    }
}
