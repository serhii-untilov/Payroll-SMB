import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentFundDto {
    @ApiProperty() id: number;
    @ApiProperty() paymentPositionId: number;
    @ApiProperty() payFundTypeId: number;
    @ApiProperty() baseSum: number;
    @ApiProperty() paySum: number;
    @ApiProperty() recordFlags: number; // See enum RecordFlags
}
