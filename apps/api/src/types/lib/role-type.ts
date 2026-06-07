export enum RoleType {
    // This role is used to update, migrate, seed DB, and perform schedule cron methods and doesn't have
    // access to any resource through the API.
    System = 'system',

    SystemAdmin = 'system-admin',
    CompanyAdmin = 'company-admin',
    Accountant = 'accountant',
    Employee = 'employee',
    Manager = 'manager',
}
