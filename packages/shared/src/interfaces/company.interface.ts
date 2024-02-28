import { IAccounting } from './accounting.interface';
import { ILaw } from './law.interface';
import { IUser } from './user.interface';

export interface ICompany {
    id: number;
    name: string;
    law: ILaw;
    taxId?: string;
    accounting: IAccounting;
    owner: IUser;
    dateFrom: Date;
    dateTo: Date;
    payPeriod: Date;
    checkDate: Date;
    createdDate: Date;
    createdUser: IUser;
    updatedDate: Date;
    updatedUser: IUser;
    deletedDate: Date;
    deletedUser?: IUser;
    version: number;
}

export type ICreateCompany = Pick<
    ICompany,
    | 'name'
    | 'law'
    | 'taxId'
    | 'accounting'
    | 'owner'
    | 'dateFrom'
    | 'dateTo'
    | 'payPeriod'
    | 'checkDate'
    | 'createdUser'
>;

export type IUpdateCompany = Partial<
    Omit<
        ICompany,
        | 'id'
        | 'owner'
        | 'createdDate'
        | 'createdUser'
        | 'updatedDate'
        | 'deletedDate'
        | 'deletedUser'
        | 'version'
    >
>;

export type IUpsertCompany = ICompany;
