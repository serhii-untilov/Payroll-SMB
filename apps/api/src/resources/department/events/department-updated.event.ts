export class DepartmentUpdatedEvent {
    constructor(
        readonly userId: string,
        readonly department: string,
    ) {}
}
