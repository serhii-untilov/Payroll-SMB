import { ApiProperty } from '@nestjs/swagger';

export class CreatePayFundDto {
    @ApiProperty() positionId: number;
    @ApiProperty() payPeriod: Date;
    @ApiProperty() accPeriod: Date;
    @ApiProperty() payFundTypeId: number;
    @ApiProperty() payFundCategory: string; // See enum PayFundCategory
    @ApiProperty() incomeSum: number;
    @ApiProperty() baseSum: number;
    @ApiProperty() rate: number;
    @ApiProperty() paySum: number;
}
