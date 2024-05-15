import { OmitType, PartialType } from '@nestjs/swagger';
import { IUpdatePayroll } from '@repo/shared';
import { Payroll } from '../entities/payroll.entity';

export class UpdatePayrollDto
    extends PartialType(
        OmitType(Payroll, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdatePayroll {}
