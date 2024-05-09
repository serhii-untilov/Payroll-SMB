import { ApiProperty } from '@nestjs/swagger';
import { ICreatePerson } from '@repo/shared';

export class CreatePersonDto implements ICreatePerson {
    @ApiProperty() firstName: string;
    @ApiProperty() lastName: string;
    @ApiProperty() middleName?: string | undefined;
    @ApiProperty() birthDate?: Date | undefined;
    @ApiProperty() taxId?: string | undefined;
    @ApiProperty() sex?: string | undefined; // See enum Sex
    @ApiProperty() phone?: string | undefined;
    @ApiProperty() email?: string | undefined;
    @ApiProperty() photo?: string | undefined;
}
