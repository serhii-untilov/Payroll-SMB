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

    // See enum PaymentPart
    accruals?: number;
    deductions?: number;

    // See enum PaymentGroup
    basic?: number;
    adjustments?: number;
    bonuses?: number;
    vacations?: number;
    sicks?: number;
    refunds?: number;
    other_accruals?: number;
    taxes?: number;
    payments?: number;
    other_deductions?: number;

    outBalance?: number;
    outCompanyDebt?: number;
    outEmployeeDebt?: number;

    funds?: number;
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
