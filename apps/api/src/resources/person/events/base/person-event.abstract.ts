import { AuditDiff } from '@/types';
import { IEvent } from '@nestjs/cqrs';
import { PersonEntity } from '../../entities/person.entity';

export abstract class PersonEvent implements IEvent {
    constructor(
        public readonly userId: string,
        public readonly personId: string,
        public readonly changes: AuditDiff<PersonEntity>,
        public readonly occurredAt: Date = new Date(),
    ) {}
}
