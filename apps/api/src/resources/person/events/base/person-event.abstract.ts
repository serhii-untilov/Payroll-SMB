import { AuditDiff } from '@/types';
import { PersonEntity } from '../../entities/person.entity';

export abstract class PersonEvent {
    constructor(
        public readonly userId: string,
        public readonly personId: string,
        public readonly changes: AuditDiff<PersonEntity>,
        public readonly occurredAt: Date = new Date(),
    ) {}
}
