import { ICompany } from './company.interface';
import { IDepartment } from './department.interface';
import { ILogger } from './logger.interface';

export interface ICompanyManager extends ILogger {
    id: number;
    firstName: string;
    lastName: string;
    company?: ICompany;
    companyId: number;
    dateFrom?: Date;
    dateTo?: Date;
    parentManager?: ICompanyManager | null;
    parentManagerId?: number | null;
    childManagers?: ICompanyManager[];
    phone?: string | null;
    email?: string | null;
    department?: IDepartment | null;
    departmentId?: number | null;
}

export type ICreateCompanyManager = Omit<
    ICompanyManager,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateCompanyManager = Partial<
    Omit<
        ICompanyManager,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;
