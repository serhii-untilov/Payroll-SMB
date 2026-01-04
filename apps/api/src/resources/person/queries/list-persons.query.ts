import { PageDto, SortingDto } from '@/resources/common/dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { PersonFiltersDto } from './dto/person-filters.dto';
import { PersonSearchDto } from './dto/person-search.dto';
import { PaginatedQuery } from '@/resources/common/queries/paginated.query';

export class ListPersonsQuery extends PaginatedQuery<PersonSearchDto, PersonFiltersDto> {
    @ApiPropertyOptional({ type: () => PersonSearchDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => PersonSearchDto)
    search?: PersonSearchDto;

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
