import { AuditLogEntity } from '@/resources/audit-log/entities/audit-log.entity';
import { AuditAction, Resource } from '@/types';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { PersonDeletedEvent } from '../../events/person-deleted.event';

@EventsHandler(PersonDeletedEvent)
export class PersonDeletedEventHandler implements IEventHandler<PersonDeletedEvent> {
    constructor(private auditLogRepository: Repository<AuditLogEntity>) {}

    async handle(event: PersonDeletedEvent): Promise<void> {
        this.auditLogRepository.create({
            aggregateType: Resource.Person,
            aggregateId: event.personId,
            action: AuditAction.Deleted,
            userId: event.userId,
            diff: event.changes,
            occurredAt: event.occurredAt,
        });
    }
}
