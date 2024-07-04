import { ApiProperty } from '@nestjs/swagger';
import { ICreatePaymentDeduction } from '@repo/shared';

export class CreatePaymentDeductionDto implements ICreatePaymentDeduction {
    @ApiProperty() id: number;
    @ApiProperty() paymentPositionId: number;
    @ApiProperty() paymentTypeId: number;
    @ApiProperty() baseSum: number;
    @ApiProperty() paySum: number;
    @ApiProperty() recordFlags: number; // See enum RecordFlags
}
