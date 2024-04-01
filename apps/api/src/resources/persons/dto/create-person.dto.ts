import { ICreatePerson } from '@repo/shared';

export class CreatePersonDto implements ICreatePerson {
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
