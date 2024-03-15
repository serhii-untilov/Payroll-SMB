import { ILogger } from './logger.interface';

export interface ICurrency extends ILogger {
    id: number;
    name: string;
    code: string;
}

export type ICreateCurrency = Omit<
    ICurrency,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateCurrency = Partial<ICreateCurrency>;
