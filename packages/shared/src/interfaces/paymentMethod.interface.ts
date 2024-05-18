import { IBank } from './bank.interface';
import { ILogger } from './logger.interface';
import { IPerson } from './person.interface';

export interface IPaymentMethod extends ILogger {
    id: number;
    person?: IPerson;
    personId: number;
    bank?: IBank;
    bankId: number;
    accountNumber: string;
}

export type ICreatePaymentMethod = Omit<
    IPaymentMethod,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdatePaymentMethod = Partial<
    Omit<
        IPaymentMethod,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;
