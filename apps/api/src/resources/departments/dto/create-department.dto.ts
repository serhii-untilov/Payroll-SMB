import { Department } from '../entities/department.entity';

export class CreateDepartmentDto {
    companyId: number;
    name: string;
    dateFrom: Date;
    dateTo: Date;
    parent: Department;
}
