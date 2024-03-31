export enum AccountingType {
    GENERIC = 'generic',
    KINDERGARTEN = 'kindergarten',
    SERVICES = 'services',
    TRADE = 'trade',
    CUSTOM = 'custom',
}
export interface IAccounting {
    id: number;
    name: string;
    type: string;
}

export type ICreateAccounting = Omit<IAccounting, 'id'>;
export type IUpdateAccounting = Partial<Omit<IAccounting, 'id'>>;
