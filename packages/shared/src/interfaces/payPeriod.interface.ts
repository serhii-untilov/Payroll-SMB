import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';

export enum PayPeriodState {
    OPENED = 'opened',
    IMPORTED = 'imported',
    CLOSED = 'closed',
}

export interface IPayPeriod extends ILogger {
    id: number | undefined;
    company?: ICompany;
    companyId: number | undefined;
    dateFrom: Date;
    dateTo: Date;
    state: string; // See PayPeriodState
    inBalance?: number;
    inCompanyDebt?: number;
    inEmployeeDebt?: number;
    outBalance?: number;
    outCompanyDebt?: number;
    outEmployeeDebt?: number;
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

export type IUpdatePayPeriod = Partial<
    Omit<
        IPayPeriod,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;
