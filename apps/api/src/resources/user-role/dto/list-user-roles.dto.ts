import { ApiProperty } from '@nestjs/swagger';
import { ListResponseDto } from '@/resources/common/dto/list-response.dto';
import { UserRoleListItemDto } from './user-role-list-item.dto';

export class ListUserRolesDto extends ListResponseDto<UserRoleListItemDto> {
    @ApiProperty({ isArray: true, type: UserRoleListItemDto })
    declare items: UserRoleListItemDto[];
}
