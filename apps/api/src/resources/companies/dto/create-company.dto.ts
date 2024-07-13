import { Logger } from '@/resources/abstract/logger.abstract';

export class CreateCompanyDto extends Logger {
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
