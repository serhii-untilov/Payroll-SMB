import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { CreatePersonCommand } from '../../commands/create-person.command';
import { PersonEntity } from '../../entities/person.entity';
import { PersonCreatedEvent } from '../../events/person-created.event';
import { PersonMapper } from '../../mappers/person.mapper';

@CommandHandler(CreatePersonCommand)
export class CreatePersonHandler {
    constructor(
        private readonly eventBus: EventBus,
        private readonly personRepository: Repository<PersonEntity>,
    ) {}

    async execute(command: CreatePersonCommand): Promise<string> {
        const changes = PersonMapper.diff(new PersonEntity(), command.payload);
        const person = PersonMapper.toEntity(command.payload);
        person.createdUserId = command.userId;
        person.updatedUserId = command.userId;
        person.id = IdGenerator.nextId();
        await this.personRepository.save(person);
        this.eventBus.publish(new PersonCreatedEvent(command.userId, person.id, changes));
        return person.id;
    }
}
