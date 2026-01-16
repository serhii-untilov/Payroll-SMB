export class JobDeletedEvent {
    constructor(
        readonly userId: string,
        readonly jobId: string,
    ) {}
}
