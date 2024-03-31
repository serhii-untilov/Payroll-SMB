import { ILogger } from './logger.interface';

export interface IBank extends ILogger {
    id: number;
    name: string;

    bankIdCode?: string | null;
    companyIdCode?: string | null;

    dateFrom?: Date;
    dateTo?: Date;
}

export type ICreateBank = Omit<
    IBank,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateBank = Partial<ICreateBank>;
