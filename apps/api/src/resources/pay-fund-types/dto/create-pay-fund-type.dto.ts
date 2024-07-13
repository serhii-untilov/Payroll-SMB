import { ApiProperty } from '@nestjs/swagger';
export class CreatePayFundTypeDto {
    @ApiProperty() name: string;
    @ApiProperty() group: string; // See enum PayFundGroup
    @ApiProperty() calcMethod: string;
    @ApiProperty() sequence: number;
    @ApiProperty() description: string;
}
