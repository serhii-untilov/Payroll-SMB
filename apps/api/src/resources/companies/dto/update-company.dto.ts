import { Logger } from '@/resources/abstract/logger.abstract';
import { ApiProperty } from '@nestjs/swagger';
import { IUpdateCompany } from '@repo/shared';

export class UpdateCompanyDto extends Logger implements IUpdateCompany {
    @ApiProperty() name: string;
    @ApiProperty() lawId: number;
    @ApiProperty() taxId: string;
    @ApiProperty() accountingId: number;
    @ApiProperty() paymentSchedule: string;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() payPeriod: Date;
    @ApiProperty() checkDate: Date;
    @ApiProperty() version: number;
}
