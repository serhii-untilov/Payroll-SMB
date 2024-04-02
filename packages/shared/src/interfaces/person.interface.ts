import { ILogger } from './logger.interface';

export enum Sex {
    MALE = 'male',
    FEMALE = 'female',
}

export interface IPerson extends ILogger {
    id: number;

    firstName: string;
    lastName: string;

    middleName?: string | undefined;

    birthDate?: Date | undefined;

    taxId?: string | undefined;

    sex?: string | undefined; // See enum Sex

    phone?: string | undefined;
    email?: string | undefined;

    photo?: string | undefined;
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
