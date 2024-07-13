import { ApiProperty } from '@nestjs/swagger';

export class AvailableAccessDto {
    @ApiProperty() roleType: string; // See enum RoleType
    @ApiProperty() resourceType: string; // See enum ResourceType
    @ApiProperty() accessType: string; // See enum AccessType
}

export class AvailableAccessUserDto {
    @ApiProperty() userId: number;
    @ApiProperty() resourceType: string; // See enum ResourceType
    @ApiProperty() accessType: string; // See enum AccessType
}

export class AvailableAccessUserCompanyDto {
    @ApiProperty() userId: number;
    @ApiProperty() companyId: number;
    @ApiProperty() resourceType: string; // See enum ResourceType
    @ApiProperty() accessType: string; // See enum AccessType
}
