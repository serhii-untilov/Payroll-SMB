import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { PaymentPosition } from '../entities/paymentPosition.entity';

export class CreatePaymentPositionDto extends IntersectionType(
    PickType(PaymentPosition, ['paymentId', 'positionId']),
    PartialType(
        OmitType(PaymentPosition, [
            'id',
            'payment',
            'paymentId',
            'position',
            'positionId',
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
