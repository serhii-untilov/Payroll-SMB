import { IUpdateDepartment } from '@repo/shared';
import { CreateDepartmentDto } from './create-department.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateDepartmentDto
    extends PartialType(CreateDepartmentDto)
    implements IUpdateDepartment {}
