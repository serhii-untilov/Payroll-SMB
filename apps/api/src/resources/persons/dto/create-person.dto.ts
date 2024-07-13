import { ApiProperty } from '@nestjs/swagger';

export class CreatePersonDto {
    @ApiProperty() firstName: string;
    @ApiProperty() lastName: string;
    @ApiProperty() middleName?: string;
    @ApiProperty() birthday?: Date;
    @ApiProperty() taxId?: string;
    @ApiProperty() sex?: string; // See enum Sex
    @ApiProperty() phone?: string;
    @ApiProperty() email?: string;
    @ApiProperty() photo?: string;
}
