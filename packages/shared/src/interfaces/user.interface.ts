import { ICompany } from './company.interface';
import { IRole } from './role.interface';

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    refreshToken: string;
    isActive: boolean;
    language: string | null | undefined;
    roles?: IRole[] | null | undefined;
    companies?: ICompany[] | null | undefined;
}

export type ICreateUser = Pick<IUser, 'firstName' | 'lastName' | 'email' | 'password' | 'roles'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
export type IPublicUserData = Partial<Omit<IUser, 'password' | 'refreshToken'>>;
