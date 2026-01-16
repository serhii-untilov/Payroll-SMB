import { Filter } from '@/resources/common/db/filter.decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsDateString, IsOptional } from 'class-validator';

export class DepartmentFiltersDto {
    @Filter('between', 'dateFrom')
    @ApiPropertyOptional({
        description: 'Date from range [from, to] YYYY-MM-DD',
        example: ['1990-01-01', '2000-12-31'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsDateString({}, { each: true })
    dateFrom?: [string, string];

    @Filter('in')
    @ApiPropertyOptional({ type: String, isArray: true })
    @IsOptional()
    @IsArray()
    companyId?: string[];

    @Filter('in')
    @ApiPropertyOptional({ type: String, isArray: true })
    @IsOptional()
    @IsArray()
    parentDepartmentId?: string[];
}
