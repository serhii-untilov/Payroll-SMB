import { PersonEvent, PersonEventType } from './abstract/person-event';

export class PersonCreatedEvent extends PersonEvent {
    constructor(userId: string, id: string) {
        super(PersonEventType.CREATED, userId, id);
    }
}
