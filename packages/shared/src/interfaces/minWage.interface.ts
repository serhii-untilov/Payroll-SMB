import { ILogger } from './logger.interface';

export interface IMinWage extends ILogger {
    id: number;
    dateFrom: Date;
    dateTo: Date;
    paySum: number;
}

export type ICreateMinWage = Omit<
    IMinWage,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateMinWage = Partial<
    Omit<
        IMinWage,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;
