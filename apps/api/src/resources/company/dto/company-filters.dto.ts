import { Filter } from '@/resources/common/db/filter.decorators';
import { PaymentSchedule } from '@/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CompanyFiltersDto {
    @Filter('between', 'payPeriod')
    @ApiPropertyOptional({
        description: 'Pay period range [from, to] YYYY-MM-DD',
        example: ['1990-01-01', '2000-12-31'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsDateString({}, { each: true })
    payPeriod?: [string, string];

    @Filter('in')
    @ApiPropertyOptional({ type: String, isArray: true })
    @IsOptional()
    @IsArray()
    lawId?: string[];

    @Filter('in')
    @ApiPropertyOptional({ type: String, isArray: true })
    @IsOptional()
    @IsArray()
    accountingId?: string[];

    @Filter('in')
    @ApiPropertyOptional({ enum: PaymentSchedule, isArray: true })
    @IsOptional()
    @IsArray()
    @IsEnum(PaymentSchedule, { each: true })
    paymentSchedule?: PaymentSchedule[];
}
