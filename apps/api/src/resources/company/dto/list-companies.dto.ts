import { ApiProperty } from '@nestjs/swagger';
import { ListResponseDto } from '@/resources/common/dto/list-response.dto';
import { CompanyListItemDto } from './company-list-item.dto';

export class ListCompaniesDto extends ListResponseDto<CompanyListItemDto> {
    @ApiProperty({ isArray: true, type: CompanyListItemDto })
    declare items: CompanyListItemDto[];
}
