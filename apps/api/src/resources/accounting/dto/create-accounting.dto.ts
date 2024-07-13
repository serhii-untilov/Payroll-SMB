import { ApiProperty } from '@nestjs/swagger';

export class CreateAccountingDto {
    @ApiProperty() name: string;
    @ApiProperty() type: string;
}
