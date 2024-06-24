import { IPayFund } from './payFund.interface';
import { IPaymentPosition } from './paymentPosition.interface';

export interface IPaymentFund {
    id: number;
    paymentPosition?: IPaymentPosition;
    paymentPositionId: number;
    payFund?: IPayFund;
    payFundId: number;
    baseSum?: number;
    paySum?: number;
    recordFlags?: number; // See enum RecordFlags
}

export type ICreatePaymentFund = Omit<IPaymentFund, 'id'>;
export type IUpdatePaymentFund = Partial<ICreatePaymentFund>;
