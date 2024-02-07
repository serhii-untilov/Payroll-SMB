export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    isActive: boolean;
}

export type ICreateUser = Pick<IUser, 'name' | 'email' | 'password' | 'isActive'>;
export type IUpdateUser = Partial<Omit<IUser, 'id'>>;
export type IUpsertUser = IUser;
export type IPublicUserData = Partial<Omit<IUser, 'password'>>;
