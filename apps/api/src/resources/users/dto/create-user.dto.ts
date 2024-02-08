import { ICreateUser } from '@repo/shared';
import { Role } from 'src/resources/roles/entities/role.entity';

export class CreateUserDto implements ICreateUser {
    name: string;
    email: string;
    password: string;
    roles: Role[];
}
