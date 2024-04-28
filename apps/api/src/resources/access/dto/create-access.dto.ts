import { ICreateAccess } from '@repo/shared';

export class CreateAccessDto implements ICreateAccess {
    roleType: string; // See enum RoleType
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}
