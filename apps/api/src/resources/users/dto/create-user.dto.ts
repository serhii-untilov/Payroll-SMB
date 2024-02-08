import { ICreateUser } from '@repo/shared';
import { Role } from 'src/resources/roles/entities/role.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto implements ICreateUser {
    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    roles: Role[] = [];
}
