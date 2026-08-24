import { ApiProperty } from '@nestjs/swagger';
import { ListResponseDto } from '@/resources/common/dto/list-response.dto';
import { DepartmentListItemDto } from './department-list-item.dto';

export class ListDepartmentsDto extends ListResponseDto<DepartmentListItemDto> {
    @ApiProperty({ isArray: true, type: DepartmentListItemDto })
    declare items: DepartmentListItemDto[];
}
