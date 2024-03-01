import { IAccounting } from './accounting.interface';
import { ILaw } from './law.interface';
import { IUser } from './user.interface';

export interface ICompany {
    id: number;
    name: string;
    law?: ILaw;
    lawId: number;
    taxId?: string;
    accounting?: IAccounting;
    accountingId: number;
    owner?: IUser;
    ownerId: number;
    dateFrom: Date;
    dateTo: Date;
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

export type ICreateCompany = Pick<
    ICompany,
    'name' | 'lawId' | 'taxId' | 'accountingId' | 'dateFrom' | 'dateTo' | 'payPeriod' | 'checkDate'
>;

export type IUpdateCompany = Partial<ICreateCompany>;
