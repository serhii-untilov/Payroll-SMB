import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class CreateMinWageDto {
    @ApiProperty({ type: String, format: 'date' })
    @Type(() => Date)
    @IsDate()
    dateFrom: Date;

    @ApiProperty({ type: String, format: 'date' })
    @Type(() => Date)
    @IsDate()
    dateTo: Date;

    @IsNumber()
    paySum: number;
}
