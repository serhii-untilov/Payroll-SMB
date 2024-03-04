import { ICompany } from './company.interface';
import { IUser } from './user.interface';

export interface IDepartment {
    id: number;
    company: ICompany;
    name: string;
    dateFrom: Date;
    dateTo: Date;

    parent?: IDepartment;

    createdDate: Date;
    createdUser?: IUser;
    createdUserId: number;
    updatedDate: Date;
    updatedUser?: IUser;
    updatedUserId: number;
    deletedDate: Date;
    deletedUser?: IUser;
    deletedUserId?: number;
    version: number;
}

export type ICreateDepartment = Omit<
    ICompany,
    | 'id'
    | 'createdDate'
    | 'createdUser'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUser'
    | 'updatedUserId: '
    | 'deletedDate'
    | 'deletedUser'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateDepartment = Partial<ICreateDepartment>;
