export interface IAccounting {
    id: number;
    name: string;
}

export type ICreateAccounting = Pick<IAccounting, 'name'>;
export type IUpdateAccounting = Partial<Omit<IAccounting, 'id'>>;
export type IUpsertAccounting = IAccounting;
