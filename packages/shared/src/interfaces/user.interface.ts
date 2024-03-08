import { IRole } from './role.interface';

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    refreshToken: string;
    isActive: boolean;
    language: string;
    role?: IRole;
    roleId: number;
}

export type ICreateUser = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password'>;
export type IUpdateUser = Partial<ICreateUser>;
export type IPublicUserData = Partial<Omit<IUser, 'password' | 'refreshToken'>>;
