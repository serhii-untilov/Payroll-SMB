export class PersonCreatedEvent {
    userId: number;
    id: number;
    constructor(userId: number, id: number) {
        this.userId = userId;
        this.id = id;
    }
}