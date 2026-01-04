import { AuditDiff } from '@/types';
import { PersonEvent } from './base/person-event.abstract';
import { PersonEntity } from '../entities/person.entity';

export class PersonDeletedEvent extends PersonEvent {
    constructor(
        public readonly userId: string,
        public readonly personId: string,
        public readonly changes: AuditDiff<PersonEntity>,
    ) {
        super(userId, personId, changes);
    }
}
