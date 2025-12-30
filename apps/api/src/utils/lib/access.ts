import { CreateAccessDto } from './../../resources/access/dto/create-access.dto';
import { Action, Resource, RoleType } from './../../types';

export function generateAccess_Full(roleType: RoleType, resource: Resource): CreateAccessDto[] {
    return [Action.Read, Action.Create, Action.Update, Action.Delete].map((key) => {
        return { roleType, resource, action: key };
    });
}

export function generateAccess_ReadOnly(roleType: RoleType, resource: Resource): CreateAccessDto[] {
    return [{ roleType, resource, action: Action.Read }];
}
