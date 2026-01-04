import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { RemovePersonCommand } from '../../commands/remove-person.command';
import { PersonEntity } from '../../entities/person.entity';
import { PersonDeletedEvent } from '../../events/person-deleted.event';
import { ConflictException } from '@nestjs/common';
import { PersonMapper } from '../../mappers/person.mapper';

@CommandHandler(RemovePersonCommand)
export class DeletePersonHandler {
    constructor(
        private readonly eventBus: EventBus,
        private readonly personRepository: Repository<PersonEntity>,
    ) {}

    async execute(command: RemovePersonCommand): Promise<void> {
        const personBefore = await this.personRepository.findOneByOrFail({
            id: command.personId,
        });
        const changes = PersonMapper.diff(personBefore, {});
        const result = await this.personRepository.update(
            { id: command.personId, version: command.version },
            { deletedDate: new Date(), deletedUserId: command.userId },
        );
        if (result.affected === 0) {
            throw new ConflictException('Person was modified or already deleted');
        }
        this.eventBus.publish(new PersonDeletedEvent(command.userId, command.personId, changes));
    }
}
