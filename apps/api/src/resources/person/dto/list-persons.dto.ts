import { ListResponseDto } from '@/resources/common/dto/list-response.dto';
import { PersonListItemDto } from './person-list-item.dto';

export class ListPersonsDto extends ListResponseDto<PersonListItemDto> {}
