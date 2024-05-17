import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IFindPayroll } from '@repo/shared';
import { Payroll } from '../entities/payroll.entity';
import { OmitType } from '@nestjs/mapped-types';

export class FindPayrollDto
    extends PartialType(OmitType(Payroll, ['transform']))
    implements IFindPayroll
{
    @ApiProperty() companyId?: number;
    @ApiProperty() relations?: boolean;
}
