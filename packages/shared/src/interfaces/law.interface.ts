export interface ILaw {
    id: number;
    name: string;
}

export type ICreateLaw = Pick<ILaw, 'name'>;
export type IUpdateLaw = Partial<Omit<ILaw, 'id'>>;
export type IUpsertLaw = ILaw;
