import { ApiProperty } from '@nestjs/swagger';
import { ICreatePaymentPosition } from '@repo/shared';

export class CreatePaymentPositionDto implements ICreatePaymentPosition {
    @ApiProperty() id: number;
    @ApiProperty() paymentId: number;
    @ApiProperty() positionId: number;
    @ApiProperty() baseSum?: number;
    @ApiProperty() deductions?: number;
    @ApiProperty() paySum: number;
    @ApiProperty() funds?: number;
    @ApiProperty() recordFlags: number; // See enum RecordFlags
}
