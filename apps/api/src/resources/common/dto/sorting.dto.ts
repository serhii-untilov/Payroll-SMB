import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class SortingDto {
    @ApiProperty()
    @IsString()
    field: string;

    @ApiProperty({ enum: ['ASC', 'DESC'] })
    @IsIn(['ASC', 'DESC'])
    order: 'ASC' | 'DESC';
}
