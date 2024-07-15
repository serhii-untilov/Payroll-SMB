export enum AccessType {
    // Standard operations
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
    ACCESS = 'access',
    // Extra operations
    ELEVATED = 'elevated', // Elevated access rights. Can modify closed documents or not current pay periods. This mode is temporary and is not used in regular routines.
}

export enum ResourceType {
    ACCESS = 'Access',
    APP_TITLE = 'App Title',
    ROLE = 'Role',
    ROLE_ACCESS = 'Role Access',
    USER_ACCESS = 'User Access',
    USER = 'User',
    PROFILE = 'Profile',
    DASHBOARD = 'Dashboard',
    ACCOUNTING = 'Accounting',
    LAW = 'Law',
    COMPANY = 'Company',
    JOB = 'Job',
    DEPARTMENT = 'Department',
    MANAGER = 'Manager',
    ACCOUNT = 'Account',
    PAYMENT_TYPE = 'Payment Type',
    FUND_TYPE = 'Fund Type',
    WORK_NORM = 'Work Norm',
    PAY_PERIOD = 'Pay Period',
    POSITION = 'Position',
    POSITION_HISTORY = 'Position History',
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
    PAY_FUND = 'Pay Fund',
    MIN_WAGE = 'Minimal Wage',
    MAX_BASE_UFC = 'Maximal Base UFC',
    TASK = 'Task',
    DEMO = 'Demo',
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

export type IAvailableAccessUser = {
    userId: number;
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
};

export type IAvailableAccessUserCompany = {
    userId: number;
    companyId: number;
    resourceType: string; // See enum ResourceType
    accessType: string; // See enum AccessType
};
