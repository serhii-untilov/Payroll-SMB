import { ILogger } from './logger.interface';

export enum AccountingType {
    GENERIC = 'generic',
    KINDERGARTEN = 'kindergarten',
    SERVICES = 'services',
    TRADE = 'trade',
    CUSTOM = 'custom',
}
export interface IAccounting extends ILogger {
    id: number;
    name: string;
    type: string;
}

export type ICreateAccounting = Pick<IAccounting, 'name' | 'type'>;
export type IUpdateAccounting = Partial<ICreateAccounting>;
