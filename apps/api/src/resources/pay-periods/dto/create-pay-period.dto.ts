import { ICreatePayPeriod } from '@repo/shared';

export class CreatePayPeriodDto implements ICreatePayPeriod {
    companyId: number;

    dateFrom: Date;
    dateTo: Date;

    state: string; // See enum PayPeriodState

    inBalance?: number;
    accrual?: number;
    deduction?: number;
    tax?: number;
    netPay?: number;
    payment?: number;
    outBalance?: number;
}
