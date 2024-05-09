import { ApiProperty } from '@nestjs/swagger';
import { ICreatePaymentType } from '@repo/shared';
export class CreatePaymentTypeDto implements ICreatePaymentType {
    @ApiProperty() name: string;
    @ApiProperty() paymentPart: string;
    @ApiProperty() paymentGroup: string;
    @ApiProperty() paymentMethod: string;
    @ApiProperty() description: string;
}
