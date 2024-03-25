import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';
import { IPerson } from './person.interface';

export interface IPosition extends ILogger {
    id: number;
    name: string;

    company?: ICompany;
    companyId: number;

    person?: IPerson;
    personId: number;

    dateFrom?: Date | null;
    dateTo?: Date | null;
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
