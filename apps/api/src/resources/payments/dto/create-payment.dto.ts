import { ApiProperty } from '@nestjs/swagger';
import { ICreatePayment } from '@repo/shared';

export class CreatePaymentDto implements ICreatePayment {
    @ApiProperty() id: number;
    @ApiProperty() companyId: number;
    @ApiProperty() payPeriod: Date;
    @ApiProperty() accPeriod: Date;
    @ApiProperty() docNumber: string;
    @ApiProperty() docDate: Date;
    @ApiProperty() paymentTypeId: number;
    @ApiProperty() dateFrom: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    @ApiProperty() dateTo: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    @ApiProperty() baseSum?: number;
    @ApiProperty() deductions?: number;
    @ApiProperty() paySum: number;
    @ApiProperty() funds?: number;
    @ApiProperty() status: string; // See enum PaymentStatus
    @ApiProperty() recordFlags: number; // See enum RecordFlags
    @ApiProperty() description?: string;
}
