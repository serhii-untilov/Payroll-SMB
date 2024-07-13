import { OmitType, PartialType } from '@nestjs/swagger';
import { PayPeriod } from '../entities/payPeriod.entity';

export class UpdatePayPeriodDto extends PartialType(
    OmitType(PayPeriod, [
        'id',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
