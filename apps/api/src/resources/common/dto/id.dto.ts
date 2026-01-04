import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class IdDto {
    @ApiProperty()
    @IsNumberString()
    id: string;
}
