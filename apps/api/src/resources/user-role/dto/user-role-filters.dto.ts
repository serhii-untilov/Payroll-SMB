import { Filter } from '@/resources/common/db/filter.decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional } from 'class-validator';

export class UserRoleFiltersDto {
    @Filter('in')
    @ApiPropertyOptional({ type: String, isArray: true })
    @IsOptional()
    @IsArray()
    userId?: string[];

    @Filter('in')
    @ApiPropertyOptional({ type: String, isArray: true })
    @IsOptional()
    @IsArray()
    companyId?: string[];

    @Filter('in')
    @ApiPropertyOptional({ type: String, isArray: true })
    @IsOptional()
    @IsArray()
    roleId?: string[];
}
