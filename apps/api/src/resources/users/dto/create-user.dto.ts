import { ApiProperty } from '@nestjs/swagger';
import { ICreateUser } from '@repo/shared';

export class CreateUserDto implements ICreateUser {
    @ApiProperty() firstName: string;
    @ApiProperty() lastName: string;
    @ApiProperty() email: string;
    @ApiProperty() password: string;
    @ApiProperty() roleId: number;
}
