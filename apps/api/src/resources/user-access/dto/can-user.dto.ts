import { Action, Resource } from '@/types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { AccessContextDto } from './access-context.dto';
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

    @ApiPropertyOptional({ type: () => AccessContextDto })
    @IsOptional()
    @Type(() => AccessContextDto)
    context?: AccessContextDto;
}
