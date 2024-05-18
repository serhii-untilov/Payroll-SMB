import { AccessType, ICreateAccess, ResourceType, RoleType } from '@repo/shared';

export function generateAccess_Full(
    roleType: RoleType,
    resourceType: ResourceType,
): ICreateAccess[] {
    return [AccessType.ACCESS, AccessType.CREATE, AccessType.UPDATE, AccessType.DELETE].map(
        (key) => {
            return { roleType, resourceType, accessType: key };
        },
    );
}

export function generateAccess_ReadOnly(
    roleType: RoleType,
    resourceType: ResourceType,
): ICreateAccess[] {
    return [{ roleType, resourceType, accessType: AccessType.ACCESS }];
}
