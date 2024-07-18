import { PersonEvent, PersonEventType } from './abstract/person-event';

export class PersonCreatedEvent extends PersonEvent {
    constructor(userId: number, id: number) {
        super(PersonEventType.CREATED, userId, id);
    }
}
