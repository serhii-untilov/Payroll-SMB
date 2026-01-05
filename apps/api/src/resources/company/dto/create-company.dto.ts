import { PaymentSchedule } from '@/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    taxId?: string;

    @ApiPropertyOptional()
    @IsNumberString()
    @IsOptional()
    lawId?: string;

    @ApiPropertyOptional()
    @IsNumberString()
    @IsOptional()
    accountingId?: string;

    @ApiPropertyOptional({ enum: PaymentSchedule, nullable: true })
    @IsOptional()
    @IsEnum(PaymentSchedule)
    paymentSchedule?: PaymentSchedule;

    @ApiPropertyOptional({ type: String, format: 'date' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dateFrom?: Date;

    @ApiPropertyOptional({ type: String, format: 'date' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    dateTo?: Date;

    @ApiPropertyOptional({ type: String, format: 'date' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    payPeriod?: Date;

    @ApiPropertyOptional({ type: String, format: 'date' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    checkDate?: Date;
}
