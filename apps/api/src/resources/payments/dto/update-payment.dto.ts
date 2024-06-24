import { OmitType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { Payment } from '../entities/payment.entity';
import { IUpdatePayment } from '@repo/shared';

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
