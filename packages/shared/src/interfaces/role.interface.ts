export enum RoleType {
    // This role is used to update, migrate, and seed DB only and doesn't have access to any resource through the API.
    SYSTEM = 'system',

    ADMIN = 'admin',

    EMPLOYER = 'employer',
    OBSERVER = 'observer',

    EMPLOYEE = 'employee',

    GUEST = 'guest',
}
export interface IRole {
    id: number;
    name: string;
    type: string;
}

export type ICreateRole = Omit<IRole, 'id'>;
export type IUpdateRole = Partial<ICreateRole>;
