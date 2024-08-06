import { PersonEvent, PersonEventType } from './abstract/person-event';

export class PersonDeletedEvent extends PersonEvent {
    constructor(userId: number, id: number) {
        super(PersonEventType.DELETED, userId, id);
    }
}
