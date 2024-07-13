import { OmitType, PartialType } from '@nestjs/swagger';
import { Department } from '../entities/department.entity';

export class UpdateDepartmentDto extends PartialType(
    OmitType(Department, [
        'id',
        'company',
        'parentDepartment',
        'childDepartments',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
