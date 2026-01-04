import { AuditLogEntity } from '@/resources/audit-log/entities/audit-log.entity';
import { AuditAction, Resource } from '@/types';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { PersonUpdatedEvent } from '../../events/person-updated.event';

@EventsHandler(PersonUpdatedEvent)
export class PersonUpdatedEventHandler implements IEventHandler<PersonUpdatedEvent> {
    constructor(private auditLogRepository: Repository<AuditLogEntity>) {}

    async handle(event: PersonUpdatedEvent): Promise<void> {
        this.auditLogRepository.create({
            aggregateType: Resource.Person,
            aggregateId: event.personId,
            action: AuditAction.Updated,
            userId: event.userId,
            diff: event.changes,
            occurredAt: event.occurredAt,
        });
    }
}
