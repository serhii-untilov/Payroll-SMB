import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from './page-meta.dto';

export class ListResponseDto<TItem> {
    @ApiProperty({ isArray: true })
    items: TItem[];

    @ApiProperty()
    page: PageMetaDto;
}
