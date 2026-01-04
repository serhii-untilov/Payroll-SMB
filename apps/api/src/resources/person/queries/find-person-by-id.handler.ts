import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonEntity } from '../entities/person.entity';
import { PersonMapper } from '../mappers/person.mapper';
import { PersonReadDto } from './dto/person-read.dto';
import { FindPersonByIdQuery } from './find-person-by-id.query';

@QueryHandler(FindPersonByIdQuery)
export class FindPersonByIdHandler implements IQueryHandler<FindPersonByIdQuery, PersonReadDto> {
    constructor(
        @InjectRepository(PersonEntity) private readonly repo: Repository<PersonEntity>,
        private readonly mapper: PersonMapper,
    ) {}

    async execute(query: FindPersonByIdQuery): Promise<PersonReadDto> {
        const person = await this.repo.findOneByOrFail({
            id: query.id,
        });

        return this.mapper.toReadDto(person);
    }
}
