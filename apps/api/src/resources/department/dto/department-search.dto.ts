import { Filter } from '@/resources/common/db/filter.decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DepartmentSearchDto {
    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;
}
