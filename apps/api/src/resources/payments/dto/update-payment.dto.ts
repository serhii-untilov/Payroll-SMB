import { OmitType, PartialType } from '@nestjs/swagger';
import { Payment } from '../entities/payment.entity';

export class UpdatePaymentDto extends PartialType(
    OmitType(Payment, [
        'id',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
