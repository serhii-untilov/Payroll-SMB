import { ApiProperty } from '@nestjs/swagger';

export class PageMetaDto {
    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    total: number;
}
