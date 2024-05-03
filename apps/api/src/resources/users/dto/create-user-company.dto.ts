import { ApiProperty } from '@nestjs/swagger';
import { ICreateUserCompany } from '@repo/shared';

export class CreateUserCompanyDto implements ICreateUserCompany {
    @ApiProperty()
    userId: number;

    @ApiProperty()
    companyId: number;

    @ApiProperty()
    roleId: number;
}
