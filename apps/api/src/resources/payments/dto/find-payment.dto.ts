import { ApiProperty } from '@nestjs/swagger';

export class FindPaymentDto {
    @ApiProperty() companyId: number;
    @ApiProperty() positionId?: number;
    @ApiProperty() payPeriod?: Date;
    @ApiProperty() accPeriod?: Date;
    @ApiProperty() paymentTypeId?: number;
    @ApiProperty() status?: string;
    @ApiProperty() relations?: boolean;
}
