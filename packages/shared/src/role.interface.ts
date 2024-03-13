export enum RoleType {
    ADMIN = 'admin',
    EMPLOYER = 'employer',
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
