export class DepartmentRestoredEvent {
    constructor(
        readonly userId: string,
        readonly departmentId: string,
    ) {}
}
