export class PersonUpdatedEvent {
    userId: number;
    id: number;
    constructor(userId: number, id: number) {
        this.userId = userId;
        this.id = id;
    }
}
