import { AuthService } from '@/auth/auth.service';
import { QueryPolicy } from '@/resources/common/policy/query-policy.interface';
import { Action, Resource } from '@/types';
import { Injectable } from '@nestjs/common';
import { ListPersonsQuery } from '../queries/list-persons.query';

@Injectable()
export class ListPersonsPolicy implements QueryPolicy<ListPersonsQuery> {
    constructor(private readonly auth: AuthService) {}

    async canExecute(_: ListPersonsQuery, userId: string, companyId?: string): Promise<boolean> {
        return await this.auth.can(userId, Resource.Person, Action.Read, { companyId });
    }
}
