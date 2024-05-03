import { ApiProperty } from '@nestjs/swagger';
import { ICreateLaw } from '@repo/shared';

export class CreateLawDto implements ICreateLaw {
    @ApiProperty() name: string;
    @ApiProperty() type: string;
}
