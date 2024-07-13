export class CreatePersonDto {
    firstName: string;
    lastName: string;
    middleName?: string;
    birthday?: Date;
    taxId?: string;
    sex?: string; // See enum Sex
    phone?: string;
    email?: string;
    photo?: string;
}
