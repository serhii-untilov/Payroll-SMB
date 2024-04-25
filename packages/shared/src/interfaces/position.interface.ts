import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';
import { IPerson } from './person.interface';

export interface IPosition extends ILogger {
    id: number;

    company?: ICompany;
    companyId: number;

    cardNumber: string; // (Табельний номер)
    sequenceNumber?: number | null; // Sequence in payroll reports to place managers on top (Порядковий номер)
    description?: string | null;

    person?: IPerson;
    personId?: number | null; // Vacancy if not defined

    dateFrom?: Date | null; // Hire date or date of open vacancy
    dateTo?: Date | null; // Dismissal date or date of close vacancy

    name?: string | null;
}

export type ICreatePosition = Omit<
    IPosition,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdatePosition = Partial<ICreatePosition>;
