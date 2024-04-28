import { IAvailableAccess } from '@repo/shared';

export class AvailableAccessDto implements IAvailableAccess {
    roleType: string; // See enum RoleType
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}
