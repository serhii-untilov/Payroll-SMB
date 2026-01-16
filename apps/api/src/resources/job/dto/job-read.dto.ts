import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JobReadDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    version: number;
}
