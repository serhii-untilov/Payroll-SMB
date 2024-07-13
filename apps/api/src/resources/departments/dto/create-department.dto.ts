import { ApiProperty } from '@nestjs/swagger';
import { Department } from '../entities/department.entity';

export class CreateDepartmentDto {
    @ApiProperty() companyId: number;
    @ApiProperty() name: string;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() parent: Department;
}
