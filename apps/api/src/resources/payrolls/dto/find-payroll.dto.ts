import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IFindPayroll } from '@repo/shared';
import { Payroll } from '../entities/payroll.entity';

export class FindPayrollDto extends PartialType(Payroll) implements IFindPayroll {
    @ApiProperty() companyId?: number;
    @ApiProperty() relations?: boolean;
}
