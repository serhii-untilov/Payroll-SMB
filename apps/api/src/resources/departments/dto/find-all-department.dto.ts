import { PickType } from '@nestjs/swagger';
import { Department } from '../entities/department.entity';

export class FindAllDepartmentDto extends PickType(Department, ['companyId']) {
    relations?: boolean;
}
