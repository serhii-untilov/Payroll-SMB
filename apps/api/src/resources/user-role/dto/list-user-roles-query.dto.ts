import { PaginatedQuery } from '@/resources/common/queries/paginated.query';
import { UserRoleFiltersDto } from './user-role-filters.dto';

export class ListUserRolesQueryDto extends PaginatedQuery<unknown, UserRoleFiltersDto> {}
