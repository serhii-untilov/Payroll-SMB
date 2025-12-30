import { Department } from './../entities/department.entity';

export class DepartmentCreatedEvent {
    userId: string;
    departmentId: string;
    companyId: string;
    constructor(userId: string, department: Department) {
        this.userId = userId;
        this.departmentId = department.id;
        this.companyId = department.companyId;
    }
}
