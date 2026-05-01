import { CalcMethod, PaymentGroup, PaymentPart } from '@/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentTypeDto {
    @ApiProperty()
    name: string;

    @ApiProperty({ enum: PaymentPart, enumName: 'PaymentPart' })
    paymentPart: PaymentPart;

    @ApiProperty({ enum: PaymentGroup, enumName: 'PaymentGroup' })
    paymentGroup: PaymentGroup;

    @ApiProperty({ enum: CalcMethod, enumName: 'CalcMethod' })
    calcMethod: CalcMethod;

    @ApiPropertyOptional()
    description: string;
}
