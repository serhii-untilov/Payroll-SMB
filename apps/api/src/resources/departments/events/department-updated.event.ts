import { Department } from '../entities/department.entity';

export class DepartmentUpdatedEvent {
    userId: number;
    departmentId: number;
    companyId: number;
    constructor(userId: number, department: Department) {
        this.userId = userId;
        this.departmentId = department.id;
        this.companyId = department.companyId;
    }
}
