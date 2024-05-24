import { ILogger } from './logger.interface';

export interface IMaxBaseUSC extends ILogger {
    id: number;
    dateFrom: Date;
    dateTo: Date;
    paySum: number;
}

export type ICreateMaxBaseUSC = Omit<
    IMaxBaseUSC,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;
export type IUpdateMaxBaseUSC = Partial<
    Omit<
        IMaxBaseUSC,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;
