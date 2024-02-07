import { ICreateUser } from '@repo/shared';

export class CreateUserDto implements ICreateUser {
    name: string;
    email: string;
    password: string;
}
