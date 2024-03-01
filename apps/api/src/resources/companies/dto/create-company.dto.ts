import { IAccounting, ICreateCompany, ILaw } from '@repo/shared';

export class CreateCompanyDto implements ICreateCompany {
    name: string;
    law: ILaw;
    taxId?: string;
    accounting: IAccounting;
    dateFrom: Date;
    dateTo: Date;
    payPeriod: Date;
    checkDate: Date;
}
