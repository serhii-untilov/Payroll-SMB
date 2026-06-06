import { PayFundCategory } from '@/types';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePayFundDto {
    @ApiProperty()
    positionId: string;

    @ApiProperty()
    payPeriod: Date;

    @ApiProperty()
    accPeriod: Date;

    @ApiProperty()
    payFundTypeId: string;

    @ApiProperty({ enum: PayFundCategory, enumName: 'PayFundCategory' })
    payFundCategory: PayFundCategory;

    @ApiProperty()
    incomeSum: number;

    @ApiProperty()
    baseSum: number;

    @ApiProperty()
    rate: number;

    @ApiProperty()
    paySum: number;
}
