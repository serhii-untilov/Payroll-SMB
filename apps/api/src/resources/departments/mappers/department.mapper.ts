import { BaseMapper } from '@/resources/common/mapper/base.mapper';
import { DepartmentReadDto } from '../dto/department-read.dto';
import { UpdateDepartmentDto } from '../dto/update-department.dto';
import { DepartmentEntity } from '../entities/department.entity';
import { DepartmentListItemDto } from '../dto/department-list-item.dto';
import { CreateDepartmentDto } from '../dto/create-department.dto';

export class DepartmentMapper extends BaseMapper<
    DepartmentEntity,
    DepartmentReadDto,
    CreateDepartmentDto,
    UpdateDepartmentDto,
    DepartmentListItemDto
> {
    constructor() {
        super(DepartmentEntity);
    }

    toReadDto(entity: DepartmentEntity): DepartmentReadDto {
        return {
            id: entity.id,
            name: entity.name,
            companyId: entity.companyId,
            companyName: entity.company?.name,
            dateFrom: entity.dateFrom,
            dateTo: entity.dateTo,
            parentDepartmentId: entity.parentDepartmentId,
            parentDepartmentName: entity.parentDepartment?.name,
            version: entity.version,
        };
    }

    toListItemDto(entity: DepartmentEntity): DepartmentListItemDto {
        return this.toReadDto(entity);
    }
}
