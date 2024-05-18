import { IPayPeriod } from '@repo/shared';

export interface IPayPeriodPaymentGroup {
    id: number;
    payPeriod?: IPayPeriod;
    payPeriodId: number;
    paymentGroup: string;
    factSum: number;
}

export type ICreatePayPeriodPaymentGroup = Omit<IPayPeriodPaymentGroup, 'id' | 'payPeriod'>;
export type IUpdatePayPeriodPaymentGroup = Partial<ICreatePayPeriodPaymentGroup>;
