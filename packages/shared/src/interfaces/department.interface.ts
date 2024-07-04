import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';

export interface IDepartment extends ILogger {
    id: number;
    name: string;
    company?: ICompany;
    companyId: number;
    dateFrom: Date;
    dateTo: Date;
    parentDepartment?: IDepartment | null;
    parentDepartmentId?: number | null;
    childDepartments?: IDepartment[];
}

export type ICreateDepartment = Omit<
    IDepartment,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateDepartment = Partial<
    Omit<
        IDepartment,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;
