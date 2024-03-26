import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';
import { IPerson } from './person.interface';

export interface IPosition extends ILogger {
    id: number;

    company?: ICompany;
    companyId: number;

    idNumber: string; // Identity number (Табельний номер)
    sequenceNumber: number; // Sequence in payroll reports to place managers on top
    description: string;

    person?: IPerson;
    personId?: number | null; // Vacancy if not defined

    dateFrom?: Date | null; // Hire date or date open vacancy
    dateTo?: Date | null; // Leave date or date close vacancy
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
