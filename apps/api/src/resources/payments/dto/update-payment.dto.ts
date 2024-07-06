import { OmitType, PartialType } from '@nestjs/swagger';
import { IUpdatePayment } from '@repo/shared';
import { Payment } from '../entities/payment.entity';

export class UpdatePaymentDto
    extends PartialType(
        OmitType(Payment, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdatePayment {}
