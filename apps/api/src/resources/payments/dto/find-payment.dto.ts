import { ApiProperty } from '@nestjs/swagger';
import { IFindPayment } from '@repo/shared';

export class FindPaymentDto implements IFindPayment {
    @ApiProperty() companyId: number;
    @ApiProperty() positionId?: number;
    @ApiProperty() payPeriod?: Date;
    @ApiProperty() accPeriod?: Date;
    @ApiProperty() paymentTypeId?: number;
    @ApiProperty() status?: string;
    @ApiProperty() relations?: boolean;
}
