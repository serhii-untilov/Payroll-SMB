import { IPayPeriod } from '@repo/shared';

export interface IPayPeriodCalcMethod {
    id: number;
    payPeriod?: IPayPeriod;
    payPeriodId: number;
    calcMethod: string; // See enum CalcMethod
    factSum: number;
}

export type ICreatePayPeriodCalcMethod = Omit<IPayPeriodCalcMethod, 'id' | 'payPeriod'>;
export type IUpdatePayPeriodCalcMethod = Partial<ICreatePayPeriodCalcMethod>;
