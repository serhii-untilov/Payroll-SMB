export class JobCreatedEvent {
    constructor(
        readonly userId: string,
        readonly jobId: string,
    ) {}
}
