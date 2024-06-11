import { PersonEvent, PersonEventType } from './abstract/PersonEvent';

export class PersonDeletedEvent extends PersonEvent {
    constructor(userId: number, id: number) {
        super(PersonEventType.DELETED, userId, id);
    }
}
