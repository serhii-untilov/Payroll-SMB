import { ApiProperty } from '@nestjs/swagger';

export class CreatePayPeriodCalcMethodDto {
    @ApiProperty() payPeriodId: number;
    @ApiProperty() calcMethod: string; // See enum CalcMethod
    @ApiProperty() factSum: number;
}
