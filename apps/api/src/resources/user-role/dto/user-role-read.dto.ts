import { ApiProperty } from '@nestjs/swagger';

export class UserRoleReadDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    userId: string;

    @ApiProperty({ type: String })
    userName: string;

    @ApiProperty({ type: String })
    companyId: string;

    @ApiProperty({ type: String })
    companyName: string;

    @ApiProperty({ type: String })
    roleId: string;

    @ApiProperty({ type: String })
    roleName: string;

    @ApiProperty()
    version: number;
}
