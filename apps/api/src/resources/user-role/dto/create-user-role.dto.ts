import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class CreateUserRoleDto {
    @ApiProperty()
    @IsNumberString()
    userId: string;

    @ApiProperty()
    @IsNumberString()
    companyId: string;

    @ApiProperty()
    @IsNumberString()
    roleId: string;
}
