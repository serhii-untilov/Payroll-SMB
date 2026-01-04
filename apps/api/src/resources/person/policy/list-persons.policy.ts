import { QueryPolicy } from '@/resources/common/policy/query-policy.interface';
import { Action, Resource } from '@/types';
import { Injectable } from '@nestjs/common';
import { ListPersonsQuery } from '../queries/list-persons.query';
import { UserAccessService } from '@/resources/user-access/user-access.service';

@Injectable()
export class ListPersonsPolicy implements QueryPolicy<ListPersonsQuery> {
    constructor(private readonly userAccess: UserAccessService) {}

    async canExecute(query: ListPersonsQuery): Promise<boolean> {
        return await this.userAccess.canUser({
            userId: query.userId,
            resource: Resource.Person,
            action: Action.Read,
        });
    }
}
