import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IFindPayment } from '@repo/shared';
import { Payment } from '../entities/payment.entity';

export class FindPaymentDto
    extends PartialType(OmitType(Payment, ['transform']))
    implements IFindPayment
{
    @ApiProperty() relations?: boolean;
}
