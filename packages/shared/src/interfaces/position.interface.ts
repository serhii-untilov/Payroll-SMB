import { IPositionBalance, IPositionHistory } from '@repo/shared';
import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';
import { IPerson } from './person.interface';

export const MAX_SEQUENCE_NUMBER = 2147483647;

export interface IPosition extends ILogger {
    id: number;
    company?: ICompany;
    companyId: number;
    cardNumber: string; // (Табельний номер)
    sequenceNumber: number; // Sequence in payroll reports to place managers on top (Порядковий номер)
    description: string;
    person?: IPerson;
    personId: number | null; // Vacancy if not defined
    dateFrom: Date; // Hire date or date of open vacancy
    dateTo: Date; // Dismissal date or date of close vacancy
    history?: IPositionHistory[];
    balance?: IPositionBalance[];
}

export type ICreatePosition = {
    companyId: number;
    cardNumber: string; // (Табельний номер)
    sequenceNumber?: number; // Sequence in payroll reports to place managers on top (Порядковий номер)
    description?: string;
    personId?: number | null; // Vacancy if not defined
    dateFrom?: Date; // Hire date or date of open vacancy
    dateTo?: Date; // Dismissal date or date of close vacancy
};

export type IUpdatePosition = Partial<
    Omit<
        IPosition,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;

export type IFindPosition = {
    companyId: number;
    onDate?: Date;
    onPayPeriodDate?: Date;
    relations?: boolean;
    employeesOnly?: boolean;
    vacanciesOnly?: boolean;
    dismissedOnly?: boolean;
    deletedOnly?: boolean;
    includeDeleted?: boolean;
};
