import { ICompany } from './company.interface';
import { IDepartment } from './department.interface';
import { ILogger } from './logger.interface';

export interface IManager extends ILogger {
    id: number;
    firstName: string;
    lastName: string;

    company?: ICompany;
    companyId: number;

    dateFrom?: Date;
    dateTo?: Date;

    parentManager?: IManager | null;
    parentManagerId?: number | null;

    childManagers?: IManager[];

    phone?: string | null;
    email?: string | null;

    department?: IDepartment | null;
    departmentId?: number | null;
}

export type ICreateManager = Omit<
    IManager,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateManager = Partial<ICreateManager>;
