import { PageDto, SortingDto } from '@/resources/common/dto';
import { PaginatedQuery } from '@/resources/common/queries/paginated.query';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { PersonSearchDto } from './person-search.dto';
import { PersonFiltersDto } from './person-filters.dto';

export class ListPersonsQueryDto extends PaginatedQuery<PersonSearchDto, PersonFiltersDto> {
    // This member is needed to generate proper Swagger documentation only, because extended by parent class
    @ApiPropertyOptional({ type: () => PersonSearchDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PersonSearchDto)
    search?: PersonSearchDto;

    // This member is needed to generate proper Swagger documentation only, because extended by parent class
    @ApiPropertyOptional({ type: () => PersonFiltersDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PersonFiltersDto)
    filters?: PersonFiltersDto;

    @ApiPropertyOptional({ type: () => SortingDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => SortingDto)
    sorting?: SortingDto;

    @ApiPropertyOptional({ type: () => PageDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PageDto)
    page?: PageDto;
}
