import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Department } from '../entities/department.entity';

export class CreateDepartmentDto extends IntersectionType(
    PickType(Department, ['companyId', 'name']),
    PartialType(PickType(Department, ['dateFrom', 'dateTo', 'parentDepartmentId'])),
) {}
