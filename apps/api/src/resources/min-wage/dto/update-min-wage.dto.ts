import { ApiProperty } from '@nestjs/swagger';
import { CreateMinWageDto } from './create-min-wage.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateMinWageDto extends PartialType(CreateMinWageDto) {
    @ApiProperty() version: number;
}
