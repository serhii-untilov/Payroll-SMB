import { ICreateCompany } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';

export class CreateCompanyDto extends Logger implements ICreateCompany {
    name: string;
    lawId: number;
    taxId: string;
    accountingId: number;
    paymentSchedule: string;
    dateFrom: Date;
    dateTo: Date;
    payPeriod: Date;
    checkDate: Date;
}
