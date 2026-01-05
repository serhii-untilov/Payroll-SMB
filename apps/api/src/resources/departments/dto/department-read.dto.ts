import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DepartmentReadDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    companyId: string;

    @ApiProperty()
    companyName: string | null | undefined;

    @ApiProperty({ type: String, format: 'date' })
    dateFrom: Date;

    @ApiProperty({ type: String, format: 'date' })
    dateTo: Date;

    @ApiProperty()
    parentDepartmentId: string | null | undefined;

    @ApiProperty()
    parentDepartmentName: string | null | undefined;

    @ApiProperty()
    version: number;
}
