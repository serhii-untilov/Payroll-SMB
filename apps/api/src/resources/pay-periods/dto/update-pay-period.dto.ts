import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { PayPeriod } from './../entities/pay-period.entity';

export class UpdatePayPeriodDto extends IntersectionType(
    PickType(PayPeriod, ['version']),
    PartialType(
        OmitType(PayPeriod, [
            'id',
            'company',
            'companyId',
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
