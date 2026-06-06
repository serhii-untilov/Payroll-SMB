import { OmitType, PartialType } from '@nestjs/swagger';
import { Payroll } from './../entities/payroll.entity';

export class UpdatePayrollDto extends PartialType(
    OmitType(Payroll, [
        'id',
        'position',
        'paymentType',
        'transform',
        'version',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
