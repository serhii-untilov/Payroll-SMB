import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IUpdatePayPeriod } from '@repo/shared';
import { PayPeriod } from '../entities/pay-period.entity';

export class UpdatePayPeriodDto
    extends PartialType(
        OmitType(PayPeriod, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdatePayPeriod {}
