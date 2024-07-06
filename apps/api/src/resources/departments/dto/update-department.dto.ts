import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IUpdateDepartment } from '@repo/shared';
import { Department } from '../entities/department.entity';

export class UpdateDepartmentDto
    extends PartialType(
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
    )
    implements IUpdateDepartment {}
