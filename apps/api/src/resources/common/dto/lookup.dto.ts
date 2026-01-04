import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

export class LookupRequestDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    search?: string;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    ids?: string[];
}

export class LookupItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;
}

export class LookupResponseDto {
    @ApiProperty({ type: [LookupItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LookupItemDto)
    rows: LookupItemDto[];
}
