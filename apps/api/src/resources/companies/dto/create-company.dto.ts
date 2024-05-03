import { ICreateCompany } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto extends Logger implements ICreateCompany {
    @ApiProperty() name: string;
    @ApiProperty() lawId: number;
    @ApiProperty() taxId: string;
    @ApiProperty() accountingId: number;
    @ApiProperty() paymentSchedule: string;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() payPeriod: Date;
    @ApiProperty() checkDate: Date;
}
