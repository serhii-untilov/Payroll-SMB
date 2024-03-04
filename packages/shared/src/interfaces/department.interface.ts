import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';

export interface IDepartment extends ILogger {
    id: number;
    company?: ICompany;
    companyId: number;
    name: string;
    dateFrom: Date;
    dateTo: Date;

    parent?: IDepartment;
}

export type ICreateDepartment = Omit<
    IDepartment,
    | 'id'
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

export type IUpdateDepartment = Partial<ICreateDepartment>;
