import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { UpdatePersonCommand } from '../../commands/update-person.command';
import { PersonEntity } from '../../entities/person.entity';
import { PersonUpdatedEvent } from '../../events/person-updated.event';
import { PersonMapper } from '../../mappers/person.mapper';
import { ConflictException } from '@nestjs/common';

@CommandHandler(UpdatePersonCommand)
export class UpdatePersonHandler {
    constructor(
        private readonly eventBus: EventBus,
        private readonly personRepository: Repository<PersonEntity>,
        private readonly mapper: PersonMapper,
    ) {}

    async execute(command: UpdatePersonCommand): Promise<void> {
        const personBefore = await this.personRepository.findOneByOrFail({
            id: command.personId,
        });
        const changes = this.mapper.diff(personBefore, command.payload);
        const result = await this.personRepository.update(
            { id: command.personId, version: command.version },
            { ...this.mapper.toPartial(command.payload), updatedUserId: command.userId },
        );
        if (result.affected === 0) {
            throw new ConflictException('Person was modified by another user');
        }
        this.eventBus.publish(new PersonUpdatedEvent(command.userId, command.personId, changes));
    }
}
