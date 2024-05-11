import { ILogger } from './logger.interface';
import { IRole } from './role.interface';

export interface IUser extends ILogger {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    refreshToken: string;
    isActive: boolean;
    language: string | null;
    role?: IRole;
    roleId: number;
}

export type ICreateUser = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IPublicUserData = Partial<Omit<IUser, 'password' | 'refreshToken'>>;
