import { ICompany } from './company.interface';
import { IRole } from './role.interface';

export interface IUserCompany {
    id: number;
    userId: number;
    company?: ICompany;
    companyId: number;
    role?: IRole;
    roleId: number;
}
