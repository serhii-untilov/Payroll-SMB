import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonEntity } from '../entities/person.entity';
import { FindPersonByIdQuery } from './find-person-by-id.query';
import { PersonReadDto } from './dto/person-read.dto';
import { PersonMapper } from '../mappers/person.mapper';

@QueryHandler(FindPersonByIdQuery)
export class FindPersonByIdHandler implements IQueryHandler<FindPersonByIdQuery, PersonReadDto> {
    constructor(
        @InjectRepository(PersonEntity)
        private readonly repo: Repository<PersonEntity>,
    ) {}

    async execute(query: FindPersonByIdQuery): Promise<PersonReadDto> {
        const person = await this.repo.findOneByOrFail({
            id: query.id,
        });

        return PersonMapper.fromEntity(person);
    }
}
