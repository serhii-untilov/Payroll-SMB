import { ILogger } from './logger.interface';
import { IPayment } from './payment.interface';
import { IPosition } from './position.interface';

export interface IPaymentPosition extends ILogger {
    id: number;
    payment?: IPayment;
    paymentId: number;
    position?: IPosition;
    positionId: number;
    baseSum?: number;
    deductions?: number;
    paySum: number;
    funds?: number;
    recordFlags: number; // See enum RecordFlags
}

export type ICreatePaymentPosition = Omit<
    IPaymentPosition,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdatePaymentPosition = Partial<
    Omit<
        IPaymentPosition,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;

export type IFindPaymentPosition = Partial<IPaymentPosition> & {
    relations?: boolean;
};
