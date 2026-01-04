import { Filter } from '@/resources/common/db/filter.decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CompanySearchDto {
    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    taxId?: string;
}
