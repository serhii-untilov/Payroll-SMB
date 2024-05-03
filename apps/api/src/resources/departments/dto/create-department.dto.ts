import { ApiProperty } from '@nestjs/swagger';
import { ICreateDepartment, IDepartment } from '@repo/shared';

export class CreateDepartmentDto implements ICreateDepartment {
    @ApiProperty() companyId: number;
    @ApiProperty() name: string;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() parent: IDepartment;
}
