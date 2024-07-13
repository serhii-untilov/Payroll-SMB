import { ApiProperty } from '@nestjs/swagger';

export class FindPaymentPositionDto {
    @ApiProperty() paymentId: number;
    @ApiProperty() relations?: boolean;
}
