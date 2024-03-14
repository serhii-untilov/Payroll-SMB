import { IUpdateCompany } from '@repo/shared';

export class UpdateCompanyDto implements IUpdateCompany {
    name: string;
    lawId: number;
    taxId: string;
    accountingId: number;
    dateFrom: Date;
    dateTo: Date;
    payPeriod: Date;
    checkDate: Date;
}
