import { ApiProperty } from '@nestjs/swagger';
import { CreateMaxBaseUscDto } from './create-max-base-usc.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMaxBaseUscDto extends PartialType(CreateMaxBaseUscDto) {
    @ApiProperty() version: number;
}
