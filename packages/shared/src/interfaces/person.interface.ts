import { ILogger } from './logger.interface';

export enum Sex {
    MALE = 'male',
    FEMALE = 'female',
}

export interface IPerson extends ILogger {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    fullName: string;
    birthday: Date | null;
    taxId: string;
    sex: string; // See enum Sex
    phone: string;
    email: string;
    photo: string;
}

export type ICreatePerson = {
    firstName: string;
    lastName: string;
    middleName?: string;
    fullName?: string;
    birthday?: Date | null;
    taxId?: string;
    sex?: string; // See enum Sex
    phone?: string;
    email?: string;
    photo?: string;
};

export type IUpdatePerson = Partial<
    Omit<
        IPerson,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;
export type IFindPerson = Partial<IPerson>;
