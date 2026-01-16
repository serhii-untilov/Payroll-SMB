export class JobRestoredEvent {
    constructor(
        readonly userId: string,
        readonly jobId: string,
    ) {}
}
