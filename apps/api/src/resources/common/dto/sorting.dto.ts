import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class SortingDto {
    @ApiPropertyOptional()
    @IsString()
    field?: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsIn(['ASC', 'DESC'])
    order?: 'ASC' | 'DESC';
}
