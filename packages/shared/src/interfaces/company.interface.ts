import { IAccounting } from './accounting.interface';
import { IDepartment } from './department.interface';
import { ILaw } from './law.interface';
import { ILogger } from './logger.interface';
import { IUser } from './user.interface';

export interface ICompany extends ILogger {
    id: number;
    name: string;
    dateFrom?: Date;
    dateTo?: Date;

    law?: ILaw;
    lawId: number;

    taxId?: string;

    accounting?: IAccounting;
    accountingId: number;

    owner?: IUser;
    ownerId: number;

    payPeriod: Date;
    checkDate: Date;

    departments?: IDepartment[];
}

export type ICreateCompany = Omit<
    ICompany,
    | 'id'
    | 'law'
    | 'accounting'
    // | 'departments'
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
