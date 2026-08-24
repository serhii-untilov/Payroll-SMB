import { ApiProperty } from '@nestjs/swagger';
import { ListResponseDto } from '@/resources/common/dto/list-response.dto';
import { PersonListItemDto } from './person-list-item.dto';

export class ListPersonsDto extends ListResponseDto<PersonListItemDto> {
    @ApiProperty({ isArray: true, type: PersonListItemDto })
    declare items: PersonListItemDto[];
}
