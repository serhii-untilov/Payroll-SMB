export enum LawType {
    UKRAINE = 'ukraine',
    CUSTOM = 'custom',
}

export interface ILaw {
    id: number;
    name: string;
    type: string;
}

export type ICreateLaw = Omit<ILaw, 'id'>;
export type IUpdateLaw = Partial<ICreateLaw>;
