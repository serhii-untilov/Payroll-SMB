import { ApiProperty } from '@nestjs/swagger';
import { IFindPayroll } from '@repo/shared';

export class FindPayrollDto implements IFindPayroll {
    @ApiProperty() companyId?: number;
    @ApiProperty() positionId?: number;
    @ApiProperty() payPeriod?: Date;
    @ApiProperty() relations?: boolean;
}
