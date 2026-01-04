import { AuditLogEntity } from '@/resources/audit-log/entities/audit-log.entity';
import { AuditAction, Resource } from '@/types';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { PersonRestoredEvent } from '../../events/person-restored.event';

@EventsHandler(PersonRestoredEvent)
export class PersonRestoredEventHandler implements IEventHandler<PersonRestoredEvent> {
    constructor(private auditLogRepository: Repository<AuditLogEntity>) {}

    async handle(event: PersonRestoredEvent): Promise<void> {
        this.auditLogRepository.create({
            aggregateType: Resource.Person,
            aggregateId: event.personId,
            action: AuditAction.Restored,
            userId: event.userId,
            diff: event.changes,
            occurredAt: event.occurredAt,
        });
    }
}
