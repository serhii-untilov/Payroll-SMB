import { ListResponseDto } from '@/resources/common/dto/list-response.dto';
import { CompanyListItemDto } from './company-list-item.dto';

export class ListCompaniesDto extends ListResponseDto<CompanyListItemDto> {}
