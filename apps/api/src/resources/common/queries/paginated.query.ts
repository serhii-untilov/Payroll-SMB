import { PageDto } from '../dto';

export abstract class PaginatedQuery<TSearch = unknown, TFilters = unknown> {
    search?: TSearch;
    filters?: TFilters;
    page?: PageDto;
}
