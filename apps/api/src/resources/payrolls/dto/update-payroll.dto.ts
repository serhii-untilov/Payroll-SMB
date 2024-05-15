import { PartialType } from '@nestjs/swagger';
import { CreatePayrollDto } from './create-payroll.dto';
import { IUpdatePayroll } from '@repo/shared';

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) implements IUpdatePayroll {}
