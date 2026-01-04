import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PageDto {
    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({ description: 'Page size', default: 20 })
    @Type(() => Number)
    @IsOptional()
    @IsInt()
    @IsPositive()
    limit: number = 20;
}
