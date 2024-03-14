import { ICreateDepartment, IDepartment } from '@repo/shared';

export class CreateDepartmentDto implements ICreateDepartment {
    id: number;
    companyId: number;
    name: string;
    dateFrom: Date;
    dateTo: Date;

    parent: IDepartment;
}
