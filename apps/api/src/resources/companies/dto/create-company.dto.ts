import { IAccounting, ICreateCompany, ILaw, IUser } from '@repo/shared';

export class CreateCompanyDto implements ICreateCompany {
    name: string;
    law: ILaw;
    taxId?: string;
    accounting: IAccounting;
    owner: IUser;
    dateFrom: Date;
    dateTo: Date;
    payPeriod: Date;
    checkDate: Date;
    createdUser: IUser;
}
