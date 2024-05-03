import { IAvailableAccess, IAvailableAccessUser, IAvailableAccessUserCompany } from '@repo/shared';

export class AvailableAccessDto implements IAvailableAccess {
    roleType: string; // See enum RoleType
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}

export class AvailableAccessUserDto implements IAvailableAccessUser {
    userId: number;
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}

export class AvailableAccessUserCompanyDto implements IAvailableAccessUserCompany {
    userId: number;
    companyId: number;
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}
