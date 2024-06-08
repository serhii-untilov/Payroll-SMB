import { ApiProperty } from '@nestjs/swagger';
import { ICreatePayPeriodCalcMethod } from '@repo/shared';

export class CreatePayPeriodCalcMethodDto implements ICreatePayPeriodCalcMethod {
    @ApiProperty() payPeriodId: number;
    @ApiProperty() calcMethod: string; // See enum CalcMethod
    @ApiProperty() factSum: number;
}
