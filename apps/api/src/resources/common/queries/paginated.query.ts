import { PageDto } from '../dto/page.dto';
import { SortingDto } from '../dto/sorting.dto';

export abstract class PaginatedQuery<TSearch = unknown, TFilters = unknown> {
    search?: TSearch;
    filters?: TFilters;
    sorting?: SortingDto;
    page?: PageDto;
}
