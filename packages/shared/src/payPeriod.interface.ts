import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';

export interface IPayPeriod extends ILogger {
    id: number;

    company?: ICompany;
    companyId: number;

    dateFrom: Date;
    dateTo: Date;

    inBalance?: number;
    accrual?: number;
    deduction?: number;
    tax?: number;
    netPay?: number;
    payment?: number;
    outBalance?: number;
}

export type ICreatePayPeriod = Omit<
    IPayPeriod,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdatePayPeriod = Partial<ICreatePayPeriod>;
