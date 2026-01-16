export class DepartmentCreatedEvent {
    constructor(
        readonly userId: string,
        readonly departmentId: string,
    ) {}
}
