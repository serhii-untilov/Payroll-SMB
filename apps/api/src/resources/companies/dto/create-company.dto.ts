import { ICreateCompany } from '@repo/shared';

export class CreateCompanyDto implements ICreateCompany {
    name: string;
    lawId: number;
    taxId: string;
    accountingId: number;
    dateFrom: Date;
    dateTo: Date;
    payPeriod: Date;
    checkDate: Date;
}
