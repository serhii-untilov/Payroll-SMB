export enum AccessType {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    ACCESS = 'access',
}

export enum ResourceType {
    ACCESS = 'Access',
    ROLE_ACCESS = 'Role Access',
    USER_ACCESS = 'User Access',
    USER = 'User',
    PROFILE = 'Profile',
    DASHBOARD = 'Dashboard',
    COMPANY = 'Company',
    DEPARTMENT = 'Department',
    MANAGER = 'Manager',
    ACCOUNT = 'Account',
    PAY_PERIOD = 'Pay Period',
    POSITION = 'Position',
    PERSON = 'Person',
    VACANCY = 'Vacancy',
    CANDIDATE = 'Candidate',
    DISMISSED = 'Dismissed',
    TIME_OFF = 'Time Off',
    DOCUMENTS = 'Documents',
    NOTES = 'Notes',
    TIME_SHEET = 'Time Sheet',
    PAYROLL = 'Payroll',
    PAYMENT = 'Payment',
    REPORT = 'Report',
}

export interface IAccess {
    id: number;
    roleType: string; // See enum RoleType
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
}

export type ICreateAccess = Omit<IAccess, 'id'>;
export type IUpdateAccess = Partial<Omit<IAccess, 'id'>>;
export type IAvailableAccess = Omit<IAccess, 'id'>;
