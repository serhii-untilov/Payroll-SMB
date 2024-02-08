import { IUser } from './user.interface';

export interface IRole {
    id: number;
    name: string;
    users: IUser[];
}

export type ICreateRole = Pick<IRole, 'name'>;
export type IUpdateRole = Partial<Omit<IRole, 'id'>>;
export type IUpsertRole = IRole;
