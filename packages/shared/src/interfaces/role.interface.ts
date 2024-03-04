import { IUser } from './user.interface';

export enum RoleType {
    SYS_ADMIN = 'sys-admin',
    EMPLOYER = 'employer',
    EMPLOYEE = 'employee',
    GUEST = 'guest',
}
export interface IRole {
    id: number;
    name: string;
    type: string;
    users?: IUser[];
}

export type ICreateRole = Omit<IRole, 'id' | 'users'>;
export type IUpdateRole = Partial<ICreateRole>;
