import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { PaymentType } from '../entities/payment-type.entity';

export class CreatePaymentTypeDto extends IntersectionType(
    PickType(PaymentType, ['name', 'paymentPart', 'paymentGroup', 'calcMethod']),
    PartialType(
        OmitType(PaymentType, [
            'id',
            'name',
            'paymentPart',
            'paymentGroup',
            'calcMethod',
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
