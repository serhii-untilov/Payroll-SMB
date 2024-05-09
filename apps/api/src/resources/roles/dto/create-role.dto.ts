import { ApiProperty } from '@nestjs/swagger';
import { ICreateRole } from '@repo/shared';

export class CreateRoleDto implements ICreateRole {
    @ApiProperty()
    name: string;

    @ApiProperty()
    type: string;
}
