import { IAccounting, IUpdateCompany, ILaw } from '@repo/shared';

export class UpdateCompanyDto implements IUpdateCompany {
    name: string;
    law: ILaw;
    taxId?: string;
    accounting: IAccounting;
    dateFrom: Date;
    dateTo: Date;
    payPeriod: Date;
    checkDate: Date;
}
