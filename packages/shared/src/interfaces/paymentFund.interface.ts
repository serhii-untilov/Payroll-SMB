import { IPayFundType } from './payFundType.interface';
import { IPaymentPosition } from './paymentPosition.interface';

export interface IPaymentFund {
    id: number;
    paymentPosition?: IPaymentPosition;
    paymentPositionId: number;
    payFundType?: IPayFundType;
    payFundTypeId: number;
    baseSum: number;
    paySum: number;
    recordFlags: number; // See enum RecordFlags
}

export type ICreatePaymentFund = Omit<IPaymentFund, 'id'>;
export type IUpdatePaymentFund = Partial<ICreatePaymentFund>;
