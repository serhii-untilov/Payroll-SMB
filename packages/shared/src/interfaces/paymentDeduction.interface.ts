import { IPaymentPosition } from './paymentPosition.interface';
import { IPaymentType } from './paymentType.interface';

export interface IPaymentDeduction {
    id: number;
    paymentPosition?: IPaymentPosition;
    paymentPositionId: number;
    paymentType?: IPaymentType;
    paymentTypeId: number;
    baseSum: number;
    paySum: number;
    recordFlags: number; // See enum RecordFlags
}

export type ICreatePaymentDeduction = Omit<IPaymentDeduction, 'id'>;
export type IUpdatePaymentDeduction = Partial<ICreatePaymentDeduction>;
