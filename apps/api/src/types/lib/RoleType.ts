export enum RoleType {
    // This role is used to update, migrate, and seed DB only and doesn't have
    // access to any resource through the API.
    System = 'system',

    Admin = 'admin',

    Employer = 'employer',
    Observer = 'observer',

    Employee = 'employee',

    Guest = 'guest',
}
