import { ApiProperty } from '@nestjs/swagger';
import { HoursByDay, ICreatePayroll } from '@repo/shared';

export class CreatePayrollDto implements ICreatePayroll {
    @ApiProperty() positionId: number;
    @ApiProperty() payPeriod: Date;
    @ApiProperty() accPeriod: Date;
    @ApiProperty() paymentTypeId: number;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() sourceType?: string;
    @ApiProperty() sourceId?: number;
    @ApiProperty() dateBegin?: Date;
    @ApiProperty() dateEnd?: Date;
    @ApiProperty() planDays?: number;
    @ApiProperty() planHours?: number;
    @ApiProperty() planSum?: number;
    @ApiProperty() rate?: number;
    @ApiProperty() factDays?: number;
    @ApiProperty() factHours?: number;
    @ApiProperty() factSum?: number;
    @ApiProperty() mask1?: number;
    @ApiProperty() mask2?: number;
    @ApiProperty() recordFlags?: number;
    @ApiProperty() fixedFlags?: number;
    @ApiProperty() planHoursByDay?: HoursByDay;
    @ApiProperty() factHoursByDay?: HoursByDay;
    @ApiProperty() parentId?: number;
}
