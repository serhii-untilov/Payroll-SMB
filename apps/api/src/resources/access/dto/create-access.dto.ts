import { ApiProperty } from '@nestjs/swagger';

export class CreateAccessDto {
    @ApiProperty() roleType: string; // See enum RoleType
    @ApiProperty() resourceType: string; // See enum ResourceType
    @ApiProperty() accessType: string; // See enum AccessType
}
