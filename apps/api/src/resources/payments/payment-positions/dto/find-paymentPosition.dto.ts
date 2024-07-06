import { ApiProperty } from '@nestjs/swagger';
import { IFindPaymentPosition } from '@repo/shared';

export class FindPaymentPositionDto implements IFindPaymentPosition {
    @ApiProperty() paymentId: number;
    @ApiProperty() relations?: boolean;
}
