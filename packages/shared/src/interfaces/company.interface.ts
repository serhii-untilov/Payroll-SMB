import { IAccounting } from './accounting.interface';
import { IDepartment } from './department.interface';
import { ILaw } from './law.interface';
import { IUser } from './user.interface';

export interface ICompany {
    id: number;
    name: string;
    dateFrom: Date;
    dateTo: Date;

    law?: ILaw;
    lawId: number;
    taxId?: string;
    accounting?: IAccounting;
    accountingId: number;
    departments?: IDepartment[];
    owner?: IUser;
    ownerId?: number;
    payPeriod: Date;
    checkDate: Date;

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

export type ICreateCompany = Omit<
    ICompany,
    | 'id'
    | 'law'
    | 'accounting'
    | 'departments'
    | 'owner'
    | 'ownerId'
    | 'createdDate'
    | 'createdUser'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUser'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUser'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateCompany = Partial<ICreateCompany>;
