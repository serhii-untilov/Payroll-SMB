import { PersonEvent, PersonEventType } from './abstract/person-event';

export class PersonDeletedEvent extends PersonEvent {
    constructor(userId: string, id: string) {
        super(PersonEventType.DELETED, userId, id);
    }
}
