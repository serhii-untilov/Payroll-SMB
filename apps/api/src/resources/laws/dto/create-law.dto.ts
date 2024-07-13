import { ApiProperty } from '@nestjs/swagger';

export class CreateLawDto {
    @ApiProperty() name: string;
    @ApiProperty() type: string;
}
