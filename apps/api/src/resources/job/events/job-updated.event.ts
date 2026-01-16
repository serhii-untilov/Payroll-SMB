export class JobUpdatedEvent {
    constructor(
        readonly userId: string,
        readonly job: string,
    ) {}
}
