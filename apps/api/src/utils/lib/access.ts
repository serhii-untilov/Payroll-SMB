import { CreateAccessDto } from './../../resources/access/dto/create-access.dto';
import { AccessType, ResourceType, RoleType } from './../../types';

export function generateAccess_Full(
    roleType: RoleType,
    resourceType: ResourceType,
): CreateAccessDto[] {
    return [AccessType.Access, AccessType.Create, AccessType.Update, AccessType.Delete].map(
        (key) => {
            return { roleType, resourceType, accessType: key };
        },
    );
}

export function generateAccess_ReadOnly(
    roleType: RoleType,
    resourceType: ResourceType,
): CreateAccessDto[] {
    return [{ roleType, resourceType, accessType: AccessType.Access }];
}
