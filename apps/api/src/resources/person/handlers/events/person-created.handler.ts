import { AuditLogEntity } from '@/resources/audit-log/entities/audit-log.entity';
import { AuditAction, Resource } from '@/types';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { PersonCreatedEvent } from '../../events/person-created.event';

@EventsHandler(PersonCreatedEvent)
export class PersonCreatedEventHandler implements IEventHandler<PersonCreatedEvent> {
    constructor(private auditLogRepository: Repository<AuditLogEntity>) {}

    async handle(event: PersonCreatedEvent): Promise<void> {
        this.auditLogRepository.create({
            aggregateType: Resource.Person,
            aggregateId: event.personId,
            action: AuditAction.Created,
            userId: event.userId,
            diff: event.changes,
            occurredAt: event.occurredAt,
        });
    }
}
