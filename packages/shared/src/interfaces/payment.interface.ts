import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';
import { IPaymentType } from './paymentType.interface';

export enum PaymentStatus {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    ACCEPTED = 'accepted',
    PAYED = 'payed',
}

export interface IPayment extends ILogger {
    id: number;
    company?: ICompany;
    companyId: number;
    payPeriod: Date;
    accPeriod: Date;
    docNumber: string;
    docDate: Date;
    paymentType?: IPaymentType;
    paymentTypeId: number;
    dateFrom: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    dateTo: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    baseSum: number;
    deductions: number;
    paySum: number;
    funds: number;
    status: string; // See enum PaymentStatus
    recordFlags: number; // See enum RecordFlags
    description: string;
}

export type ICreatePayment = {
    companyId: number;
    payPeriod: Date;
    accPeriod: Date;
    docNumber?: string;
    docDate?: Date;
    paymentTypeId: number;
    dateFrom?: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    dateTo?: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    baseSum?: number;
    deductions?: number;
    paySum?: number;
    funds?: number;
    status?: string; // See enum PaymentStatus
    recordFlags?: number; // See enum RecordFlags
    description?: string;
};

export type IUpdatePayment = Partial<
    Omit<
        IPayment,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;

export type IFindPayment = {
    companyId: number;
    positionId?: number;
    payPeriod?: Date;
    accPeriod?: Date;
    paymentTypeId?: number;
    status?: string;
    relations?: boolean;
};
