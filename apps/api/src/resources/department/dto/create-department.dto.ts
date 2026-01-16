import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumberString, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumberString()
    companyId: string;

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

    @ApiPropertyOptional()
    @IsNumberString()
    @IsOptional()
    parentDepartmentId?: string | null;
}
