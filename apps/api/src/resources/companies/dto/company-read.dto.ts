import { PaymentSchedule } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CompanyReadDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ nullable: true })
    taxId: string | null;

    @ApiProperty()
    lawId: string;

    @ApiProperty()
    lawName: string | undefined;

    @ApiProperty()
    accountingId: string;

    @ApiProperty()
    accountingName: string | undefined;

    @ApiProperty({ enum: PaymentSchedule, nullable: true })
    paymentSchedule: PaymentSchedule | null;

    @ApiProperty({ type: String, format: 'date' })
    dateFrom: Date;

    @ApiProperty({ type: String, format: 'date' })
    dateTo: Date;

    @ApiProperty({ type: String, format: 'date' })
    payPeriod: Date;

    @ApiProperty({ type: String, format: 'date' })
    checkDate: Date;

    @ApiProperty()
    version: number;
}
