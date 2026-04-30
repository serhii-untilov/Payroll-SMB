import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsArray, IsEnum, ArrayMinSize, ArrayMaxSize, IsDateString } from 'class-validator';
import { Gender } from '@/types';
import { Filter } from '@/resources/common/db/filter.decorators';

export class PersonFiltersDto {
    @Filter('between', 'birthDate')
    @ApiPropertyOptional({
        description: 'Birthday range [from, to] YYYY-MM-DD',
        example: ['1990-01-01', '2000-12-31'],
        type: [String],
    })
    @IsOptional()
    @IsArray()
    @ArrayMinSize(2)
    @ArrayMaxSize(2)
    @IsDateString({}, { each: true })
    birthDate?: [string, string];

    @Filter('in')
    @ApiPropertyOptional({ enum: Gender, isArray: true })
    @IsOptional()
    @IsArray()
    @IsEnum(Gender, { each: true })
    gender?: Gender[];
}
