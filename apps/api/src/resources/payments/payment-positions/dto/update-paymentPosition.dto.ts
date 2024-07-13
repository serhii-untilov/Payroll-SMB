import { OmitType, PartialType } from '@nestjs/swagger';
import { PaymentPosition } from '../entities/paymentPosition.entity';

export class UpdatePaymentPositionDto extends PartialType(
    OmitType(PaymentPosition, [
        'id',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
