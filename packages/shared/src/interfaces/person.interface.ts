import { ILogger } from './logger.interface';

export enum Sex {
    MALE = 'male',
    FEMALE = 'female',
    UNDEFINED = 'undefined',
}

export interface IPerson extends ILogger {
    id: number;

    firstName: string;
    middleName: string;
    lastName: string;

    birthDate?: Date | null;
    deathDate?: Date | null;

    taxId?: string;

    sex?: string;

    phone?: string;
    email?: string;

    photo?: string;
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

export type IUpdatePerson = Partial<ICreatePerson>;
