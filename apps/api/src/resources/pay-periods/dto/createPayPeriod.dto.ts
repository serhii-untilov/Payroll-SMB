import { ApiProperty } from '@nestjs/swagger';
import { ICreatePayPeriod } from '@repo/shared';

export class CreatePayPeriodDto implements ICreatePayPeriod {
    @ApiProperty()
    companyId: number;

    @ApiProperty()
    dateFrom: Date;
    @ApiProperty()
    dateTo: Date;

    @ApiProperty()
    state: string;

    @ApiProperty()
    inBalance?: number;

    @ApiProperty()
    accrual?: number;

    @ApiProperty()
    deduction?: number;

    @ApiProperty()
    tax?: number;

    @ApiProperty()
    netPay?: number;

    @ApiProperty()
    payment?: number;

    @ApiProperty()
    outBalance?: number;
}
