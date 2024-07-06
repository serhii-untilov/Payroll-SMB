import { ApiProperty } from '@nestjs/swagger';
import { ICreatePaymentFund } from '@repo/shared';

export class CreatePaymentFundDto implements ICreatePaymentFund {
    @ApiProperty() id: number;
    @ApiProperty() paymentPositionId: number;
    @ApiProperty() payFundTypeId: number;
    @ApiProperty() baseSum: number;
    @ApiProperty() paySum: number;
    @ApiProperty() recordFlags: number; // See enum RecordFlags
}
