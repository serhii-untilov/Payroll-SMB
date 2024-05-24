import { ApiProperty } from '@nestjs/swagger';
import { ICreatePayFund } from '@repo/shared';

export class CreatePayFundDto implements ICreatePayFund {
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
