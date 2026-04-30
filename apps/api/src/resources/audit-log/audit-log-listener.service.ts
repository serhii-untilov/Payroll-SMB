import { AuditLogEntity } from './entities/audit-log.entity';
import { AuditAction, Resource } from '@/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonCreatedEvent } from '../person/events/person-created.event';
import { PersonUpdatedEvent } from '../person/events/person-updated.event';
import { PersonDeletedEvent } from '../person/events/person-deleted.event';
import { PersonRestoredEvent } from '../person/events/person-restored.event';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AuditLogListenerService {
    constructor(@InjectRepository(AuditLogEntity) private auditLogRepository: Repository<AuditLogEntity>) {}

    @OnEvent(PersonCreatedEvent.name)
    async handlePersonCreated(event: PersonCreatedEvent): Promise<void> {
        await this.auditLogRepository.save({
            aggregateType: Resource.Person,
            aggregateId: event.personId,
            action: AuditAction.Created,
            userId: event.userId,
            diff: event.changes,
            occurredAt: event.occurredAt,
        });
    }

    @OnEvent(PersonUpdatedEvent.name)
    async handlePersonUpdated(event: PersonUpdatedEvent): Promise<void> {
        await this.auditLogRepository.save({
            aggregateType: Resource.Person,
            aggregateId: event.personId,
            action: AuditAction.Updated,
            userId: event.userId,
            diff: event.changes,
            occurredAt: event.occurredAt,
        });
    }

    @OnEvent(PersonDeletedEvent.name)
    async handlePersonDeleted(event: PersonDeletedEvent): Promise<void> {
        await this.auditLogRepository.save({
            aggregateType: Resource.Person,
            aggregateId: event.personId,
            action: AuditAction.Deleted,
            userId: event.userId,
            diff: event.changes,
            occurredAt: event.occurredAt,
        });
    }

    @OnEvent(PersonRestoredEvent.name)
    async handlePersonRestored(event: PersonRestoredEvent): Promise<void> {
        await this.auditLogRepository.save({
            aggregateType: Resource.Person,
            aggregateId: event.personId,
            action: AuditAction.Restored,
            userId: event.userId,
            diff: event.changes,
            occurredAt: event.occurredAt,
        });
    }
}
