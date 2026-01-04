import { PageDto, SortingDto } from '../dto';

export abstract class PaginatedQuery<TSearch = unknown, TFilters = unknown> {
    search?: TSearch;
    filters?: TFilters;
    sorting?: SortingDto;
    page?: PageDto;
}
