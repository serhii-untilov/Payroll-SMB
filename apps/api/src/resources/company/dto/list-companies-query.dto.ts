import { PaginatedQuery } from '@/resources/common/queries/paginated.query';
import { CompanySearchDto } from './company-search.dto';
import { CompanyFiltersDto } from './company-filters.dto';

export class ListCompaniesQueryDto extends PaginatedQuery<CompanySearchDto, CompanyFiltersDto> {}
