import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Department } from './../entities/department.entity';

export class CreateDepartmentDto extends IntersectionType(
    PickType(Department, ['companyId', 'name']),
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
            'version',
        ]),
    ),
) {}
