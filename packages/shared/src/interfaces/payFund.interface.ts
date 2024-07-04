import { IPayFundType } from './payFundType.interface';
import { IPosition } from './position.interface';

export interface IPayFund {
    id: number;
    position?: IPosition;
    positionId: number;
    payPeriod: Date;
    accPeriod: Date;
    payFundType?: IPayFundType;
    payFundTypeId: number;
    payFundCategory: string; // See enum PayFundCategory
    incomeSum: number;
    baseSum: number;
    rate: number;
    paySum: number;
}

export type ICreatePayFund = Omit<IPayFund, 'id'>;
export type IUpdatePayFund = Partial<Omit<IPayFund, 'id'>>;

export type IFindPayFund = {
    companyId?: number;
    positionId?: number;
    payPeriod?: Date;
    relations?: boolean;
};
