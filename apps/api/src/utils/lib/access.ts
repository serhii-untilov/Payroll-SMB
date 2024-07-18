import { CreateAccessDto } from '@/resources';
import { AccessType, ResourceType, RoleType } from '@/types';

export function generateAccess_Full(
    roleType: RoleType,
    resourceType: ResourceType,
): CreateAccessDto[] {
    return [AccessType.ACCESS, AccessType.CREATE, AccessType.UPDATE, AccessType.DELETE].map(
        (key) => {
            return { roleType, resourceType, accessType: key };
        },
    );
}

export function generateAccess_ReadOnly(
    roleType: RoleType,
    resourceType: ResourceType,
): CreateAccessDto[] {
    return [{ roleType, resourceType, accessType: AccessType.ACCESS }];
}
