import { ApiProperty } from '@nestjs/swagger';
export class CreatePaymentTypeDto {
    @ApiProperty() name: string;
    @ApiProperty() paymentPart: string;
    @ApiProperty() paymentGroup: string;
    @ApiProperty() calcMethod: string;
    @ApiProperty() description: string;
}
