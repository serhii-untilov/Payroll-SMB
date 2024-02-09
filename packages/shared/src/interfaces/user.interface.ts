import { IRole } from './role.interface';

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    refreshToken: string;
    isActive: boolean;
    roles: IRole[];
}

export type ICreateUser = Pick<IUser, 'name' | 'email' | 'password' | 'roles'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
export type IPublicUserData = Partial<Omit<IUser, 'password' | 'refreshToken'>>;
