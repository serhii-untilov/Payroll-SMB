import { OmitType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { IUpdatePaymentPosition } from '@repo/shared';
import { PaymentPosition } from '../entities/paymentPosition.entity';

export class UpdatePaymentPositionDto
    extends PartialType(
        OmitType(PaymentPosition, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdatePaymentPosition {}
