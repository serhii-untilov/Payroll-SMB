import { PersonEvent, PersonEventType } from './abstract/person-event';

export class PersonUpdatedEvent extends PersonEvent {
    constructor(userId: string, id: string) {
        super(PersonEventType.UPDATED, userId, id);
    }
}
