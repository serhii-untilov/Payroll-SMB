import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Department } from './../entities/department.entity';
import { CreateDepartmentDto } from './create-department.dto';

export class UpdateDepartmentDto extends IntersectionType(
    PickType(Department, ['version']),
    PartialType(CreateDepartmentDto),
) {}
