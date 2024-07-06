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
    | 'company'
    | 'parentDepartment'
    | 'childDepartments'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
>;

export type IUpdateDepartment = Partial<ICreateDepartment>;
