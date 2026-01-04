import { Filter } from '@/resources/common/db/filter.decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PersonSearchDto {
    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    firstName?: string;

    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lastName?: string;

    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    middleName?: string;

    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    taxId?: string;

    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string;

    @Filter('ilike')
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    email?: string;
}
