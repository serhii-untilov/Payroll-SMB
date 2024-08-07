export enum AccessType {
    // Standard operations
    Create = 'create',
    Update = 'update',
    Delete = 'delete',
    Access = 'access',
    // Extra operations
    Elevated = 'elevated', // Elevated access rights. Can modify closed documents or not current pay periods. This mode is temporary and is not used in regular routines.
}

export enum ResourceType {
    Access = 'Access',
    Account = 'Account',
    Accounting = 'Accounting',
    AppTitle = 'App Title',
    Candidate = 'Candidate',
    Company = 'Company',
    Dashboard = 'Dashboard',
    Demo = 'Demo',
    Department = 'Department',
    Dismissed = 'Dismissed',
    Documents = 'Documents',
    FundType = 'Fund Type',
    Job = 'Job',
    Law = 'Law',
    Manager = 'Manager',
    MaxBaseUfc = 'Maximal Base UFC',
    MinWage = 'Minimal Wage',
    Notes = 'Notes',
    PayFund = 'Pay Fund',
    Payment = 'Payment',
    PaymentPosition = 'Payment Position',
    PaymentType = 'Payment Type',
    PayPeriod = 'Pay Period',
    Payroll = 'Payroll',
    Person = 'Person',
    Position = 'Position',
    PositionHistory = 'Position History',
    Profile = 'Profile',
    Report = 'Report',
    Role = 'Role',
    RoleAccess = 'Role Access',
    Task = 'Task',
    TimeOff = 'Time Off',
    TimeSheet = 'Time Sheet',
    User = 'User',
    UserAccess = 'User Access',
    Vacancy = 'Vacancy',
    WorkNorm = 'Work Norm',
}
