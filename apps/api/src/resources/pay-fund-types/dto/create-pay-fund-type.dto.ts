import { PayFundCalcMethod, PayFundGroup } from '@/types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePayFundTypeDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ enum: PayFundGroup, enumName: 'PayFundGroup' })
    @IsEnum(PayFundGroup)
    group: PayFundGroup;

    @ApiProperty({ enum: PayFundCalcMethod, enumName: 'PayFundCalcMethod' })
    @IsEnum(PayFundCalcMethod)
    calcMethod: PayFundCalcMethod;

    @IsNumber()
    @ApiProperty()
    sequence: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    description: string;
}
