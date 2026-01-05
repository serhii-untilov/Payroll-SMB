import { Field } from '@/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class ActionContextDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    companyId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    resourceId?: string;

    @ApiPropertyOptional({ enum: Field })
    @IsOptional()
    field?: Field;
}
