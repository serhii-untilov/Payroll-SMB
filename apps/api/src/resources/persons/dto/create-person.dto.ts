import { ApiProperty } from '@nestjs/swagger';
import { ICreatePerson } from '@repo/shared';

export class CreatePersonDto implements ICreatePerson {
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
