import { OmitType, PartialType } from '@nestjs/swagger';
import { IUpdatePaymentType } from '@repo/shared';
import { PaymentType } from '../entities/payment-type.entity';

export class UpdatePaymentTypeDto
    extends PartialType(
        OmitType(PaymentType, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdatePaymentType {}
