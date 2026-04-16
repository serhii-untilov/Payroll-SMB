export class DepartmentUpdatedEvent {
    constructor(
        readonly userId: string,
        readonly departmentId: string,
    ) {}
}
