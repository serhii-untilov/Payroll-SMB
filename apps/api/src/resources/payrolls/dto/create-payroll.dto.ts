import { ApiProperty } from '@nestjs/swagger';
import { HoursByDay } from '@repo/shared';

export class CreatePayrollDto {
    @ApiProperty() positionId: number;
    @ApiProperty() payPeriod: Date;
    @ApiProperty() accPeriod: Date;
    @ApiProperty() paymentTypeId: number;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() sourceType?: string | null;
    @ApiProperty() sourceId?: number | null;
    @ApiProperty() dateBegin?: Date | null;
    @ApiProperty() dateEnd?: Date | null;
    @ApiProperty() planDays?: number;
    @ApiProperty() planHours?: number;
    @ApiProperty() planSum?: number;
    @ApiProperty() rate?: number;
    @ApiProperty() factDays?: number;
    @ApiProperty() factHours?: number;
    @ApiProperty() factSum: number;
    @ApiProperty() mask1?: number;
    @ApiProperty() mask2?: number;
    @ApiProperty() recordFlags: number;
    @ApiProperty() fixedFlags?: number;
    @ApiProperty() planHoursByDay?: HoursByDay | null;
    @ApiProperty() factHoursByDay?: HoursByDay | null;
    @ApiProperty() parentId?: number | null;
}
