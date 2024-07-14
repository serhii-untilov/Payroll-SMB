import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Department } from './../entities/department.entity';

export class UpdateDepartmentDto extends IntersectionType(
    PickType(Department, ['version']),
    PartialType(
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
    ),
) {}
