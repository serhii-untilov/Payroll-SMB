export class AvailableAccessDto {
    roleType: string; // See enum RoleType
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}

export class AvailableAccessUserDto {
    userId: number;
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}

export class AvailableAccessUserCompanyDto {
    userId: number;
    companyId: number;
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}
