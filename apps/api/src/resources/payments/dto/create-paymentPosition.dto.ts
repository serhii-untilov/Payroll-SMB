import { ApiProperty } from '@nestjs/swagger';
import { ICreatePaymentPosition } from '@repo/shared';

export class CreatePaymentPositionDto implements ICreatePaymentPosition {
    @ApiProperty() id: number;
    @ApiProperty() paymentId: number;
    @ApiProperty() positionId: number;
    @ApiProperty() grossPay?: number;
    @ApiProperty() deductions?: number;
    @ApiProperty() netPay?: number;
    @ApiProperty() funds?: number;
    @ApiProperty() status: string; // See enum PaymentStatus
    @ApiProperty() recordFlags?: number; // See enum RecordFlags
}
