import { ICreateUser } from '@payroll/models';

export class CreateUserDto implements ICreateUser {
    name: string;
    email: string;
    password: string;
}
