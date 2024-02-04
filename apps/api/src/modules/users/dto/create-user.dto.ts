import { ICreateUser } from 'shared';

export class CreateUserDto implements ICreateUser {
    name: string;
    email: string;
    password: string;
}
