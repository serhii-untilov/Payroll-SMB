export class DepartmentDeletedEvent {
    constructor(
        readonly userId: string,
        readonly departmentId: string,
    ) {}
}
