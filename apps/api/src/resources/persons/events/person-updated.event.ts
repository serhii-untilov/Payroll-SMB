import { PersonEvent, PersonEventType } from './abstract/person-event';

export class PersonUpdatedEvent extends PersonEvent {
    constructor(userId: number, id: number) {
        super(PersonEventType.UPDATED, userId, id);
    }
}
