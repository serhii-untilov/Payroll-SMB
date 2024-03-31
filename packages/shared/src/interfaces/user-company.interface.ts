import { ICompany } from './company.interface';
import { IRole } from './role.interface';

export interface IUserCompany {
    userId: number;
    company?: ICompany;
    companyId: number;
    role?: IRole;
    roleId: number;
}
