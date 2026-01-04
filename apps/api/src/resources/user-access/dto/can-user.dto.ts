import { Action, Resource } from '@/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { ActionContextDto } from './action-context.dto';
import { Type } from 'class-transformer';

export class CanUserDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsNumberString()
    userId: string;

    @ApiPropertyOptional({ enum: Resource })
    @IsOptional()
    resource: Resource;

    @ApiPropertyOptional({ enum: Action })
    @IsOptional()
    action: Action;

    @ApiPropertyOptional({ type: () => ActionContextDto })
    @IsOptional()
    @Type(() => ActionContextDto)
    context?: ActionContextDto;
}
