import { ApiProperty } from '@nestjs/swagger';

export class CreateUserCompanyDto {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    companyId: number;

    @ApiProperty()
    roleId: number;
}
