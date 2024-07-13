import { ApiProperty } from '@nestjs/swagger';
import { Logger } from '@/resources/abstract/logger.abstract';

export class CreateCompanyDto extends Logger {
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
