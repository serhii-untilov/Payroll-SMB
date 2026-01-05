import { ListResponseDto } from '@/resources/common/dto/list-response.dto';
import { DepartmentListItemDto } from './department-list-item.dto';

export class ListDepartmentsDto extends ListResponseDto<DepartmentListItemDto> {}
