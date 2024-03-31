import { IAccounting } from './accounting.interface';
import { IDepartment } from './department.interface';
import { ILaw } from './law.interface';
import { ILogger } from './logger.interface';

export enum PaymentSchedule {
    EVERY_15_DAY = 'every-15-day', // Every 15th and last day of month
    LAST_DAY = 'last-day', // Last day of month
    NEXT_MONTH = 'next-month', // First day of the next month
}
export interface ICompany extends ILogger {
    id: number;
    name: string;
    dateFrom?: Date | null;
    dateTo?: Date | null;

    law?: ILaw;
    lawId: number;

    taxId?: string;

    accounting?: IAccounting;
    accountingId: number;

    paymentSchedule: string; // See PaymentSchedule

    payPeriod: Date;
    checkDate: Date;

    departments?: IDepartment[];
}

export type ICreateCompany = Omit<
    ICompany,
    | 'id'
    | 'law'
    | 'accounting'
    | 'departments'
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
