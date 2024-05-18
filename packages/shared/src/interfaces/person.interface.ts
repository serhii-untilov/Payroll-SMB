import { ILogger } from './logger.interface';

export enum Sex {
    MALE = 'male',
    FEMALE = 'female',
}

export interface IPerson extends ILogger {
    id: number;
    firstName: string;
    lastName: string;
    middleName?: string | null;
    fullName?: string | null;
    birthDate?: Date | null;
    taxId?: string | null;
    sex?: string | null; // See enum Sex
    phone?: string | null;
    email?: string | null;
    photo?: string | null;
}

export type ICreatePerson = Omit<
    IPerson,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

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
