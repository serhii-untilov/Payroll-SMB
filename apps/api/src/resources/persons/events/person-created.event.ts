import { PersonEvent, PersonEventType } from './abstract/PersonEvent';

export class PersonCreatedEvent extends PersonEvent {
    constructor(userId: number, id: number) {
        super(PersonEventType.CREATED, userId, id);
    }
}
