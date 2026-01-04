export class FindPersonByIdQuery {
    constructor(
        public readonly userId: string,
        public readonly id: string,
    ) {}
}
