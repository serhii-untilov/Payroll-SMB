import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Payroll } from './../entities/payroll.entity';

export class CreatePayrollDto extends IntersectionType(
    PickType(Payroll, [
        'positionId',
        'payPeriod',
        'accPeriod',
        'paymentTypeId',
        'dateFrom',
        'dateTo',
        'factSum',
        'recordFlags',
    ]),
    PartialType(
        OmitType(Payroll, [
            'id',
            'positionId',
            'payPeriod',
            'accPeriod',
            'paymentTypeId',
            'dateFrom',
            'dateTo',
            'factSum',
            'recordFlags',
            'paymentType',
            'transform',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
            'version',
        ]),
    ),
) {}
