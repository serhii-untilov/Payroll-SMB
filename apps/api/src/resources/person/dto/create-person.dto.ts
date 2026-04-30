import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsEmail, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from '@/types';

export class CreatePersonDto {
    @ApiProperty()
    @IsString()
    firstName: string;

    @ApiProperty()
    @IsString()
    lastName: string;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    middleName?: string | null;

    @ApiPropertyOptional({ type: String, format: 'date' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    birthDate?: Date | null;

    @ApiProperty()
    @IsString()
    taxId: string;

    @ApiPropertyOptional({ enum: Gender, nullable: true })
    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsString()
    phone?: string | null;

    @ApiPropertyOptional({ nullable: true })
    @IsOptional()
    @IsEmail()
    email?: string | null;
}
