import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDeductionDto {
    @ApiProperty() id: number;
    @ApiProperty() paymentPositionId: number;
    @ApiProperty() paymentTypeId: number;
    @ApiProperty() baseSum: number;
    @ApiProperty() paySum: number;
    @ApiProperty() recordFlags: number; // See enum RecordFlags
}
