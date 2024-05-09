import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';
import { IRole } from './role.interface';
import { IUser } from './user.interface';

export interface IUserCompany extends ILogger {
    id: number;
    user?: IUser;
    userId: number;
    company?: ICompany;
    companyId: number;
    role?: IRole;
    roleId: number;
}

export type ICreateUserCompany = Pick<IUserCompany, 'userId' | 'companyId' | 'roleId'>;
export type IUpdateUserCompany = Partial<ICreateUserCompany>;
