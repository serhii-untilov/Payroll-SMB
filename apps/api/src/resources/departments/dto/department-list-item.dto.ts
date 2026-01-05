import { DepartmentReadDto } from './department-read.dto';

export const DEPARTMENT_SORTING_MAP = {
    name: 'p.name',
    dateFrom: 'p.dateFrom',
    companyName: 'company.name',
    parentDepartmentName: 'parentDepartment.name',
} as const;

export type DepartmentSortableField = keyof typeof DEPARTMENT_SORTING_MAP;

export class DepartmentListItemDto extends DepartmentReadDto {}
