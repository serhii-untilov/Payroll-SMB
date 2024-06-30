import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IFindPaymentPosition } from '@repo/shared';
import { PaymentPosition } from '../entities/paymentPosition.entity';

export class FindPaymentPositionDto
    extends PartialType(OmitType(PaymentPosition, ['transform']))
    implements IFindPaymentPosition
{
    @ApiProperty() relations?: boolean;
}
