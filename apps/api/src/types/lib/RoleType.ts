export enum RoleType {
    // This role is used to update, migrate, and seed DB only and doesn't have
    // access to any resource through the API.
    System = 'system',

    SystemAdmin = 'system-admin',
    CompanyAdmin = 'company-admin',
    Accountant = 'accountant',
    Employee = 'employee',
    Manager = 'manager',
}
