import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Payment } from './../entities/payment.entity';

export class CreatePaymentDto extends IntersectionType(
    PickType(Payment, ['companyId', 'paymentTypeId']),
    PartialType(
        OmitType(Payment, [
            'id',
            'company',
            'paymentType',
            'paymentPositions',
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
