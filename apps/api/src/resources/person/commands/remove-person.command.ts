export class RemovePersonCommand {
    constructor(
        public readonly userId: string,
        public readonly personId: string,
        public readonly version: number,
    ) {}
}
