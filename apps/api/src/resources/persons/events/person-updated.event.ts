import { PersonEvent, PersonEventType } from './abstract/PersonEvent';

export class PersonUpdatedEvent extends PersonEvent {
    constructor(userId: number, id: number) {
        super(PersonEventType.UPDATED, userId, id);
    }
}
