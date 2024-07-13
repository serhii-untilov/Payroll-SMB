import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentPositionDto {
    @ApiProperty() paymentId: number;
    @ApiProperty() positionId: number;
    @ApiProperty() baseSum: number;
    @ApiProperty() deductions: number;
    @ApiProperty() paySum: number;
    @ApiProperty() funds: number;
    @ApiProperty() recordFlags: number; // See enum RecordFlags
}
