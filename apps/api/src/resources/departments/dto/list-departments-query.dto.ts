import { PaginatedQuery } from '@/resources/common/queries/paginated.query';
import { DepartmentFiltersDto } from './department-filters.dto';
import { DepartmentSearchDto } from './department-search.dto';

export class ListDepartmentsQueryDto extends PaginatedQuery<DepartmentSearchDto, DepartmentFiltersDto> {}
