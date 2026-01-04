import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { RestorePersonCommand } from '../../commands/restore-person.command';
import { PersonEntity } from '../../entities/person.entity';
import { ConflictException } from '@nestjs/common';
import { PersonMapper } from '../../mappers/person.mapper';
import { PersonRestoredEvent } from '../../events/person-restored.event';

@CommandHandler(RestorePersonCommand)
export class RestorePersonHandler {
    constructor(
        private readonly eventBus: EventBus,
        private readonly personRepository: Repository<PersonEntity>,
    ) {}

    async execute(command: RestorePersonCommand): Promise<void> {
        const personBefore = await this.personRepository.findOneOrFail({
            where: { id: command.personId },
            withDeleted: true,
        });
        const personAfter = PersonMapper.fromEntity(personBefore);
        const changes = PersonMapper.diff(personBefore, personAfter);
        const result = await this.personRepository.update(
            { id: command.personId, version: command.version },
            { deletedDate: null, deletedUserId: null },
        );
        if (result.affected === 0) {
            throw new ConflictException('Person was modified or already restored');
        }
        this.eventBus.publish(new PersonRestoredEvent(command.userId, command.personId, changes));
    }
}
