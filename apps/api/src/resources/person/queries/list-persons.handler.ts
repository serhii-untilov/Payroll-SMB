import { ApplyFiltersUtil } from '@/resources/common/db/apply-filters.util';
import { PaginationUtils } from '@/resources/common/db/pagination.utils';
import { SortingUtils } from '@/resources/common/db/sorting.utils';
import { ForbiddenException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonEntity } from '../entities/person.entity';
import { PersonMapper } from '../mappers/person.mapper';
import { ListPersonsPolicy } from '../policy/list-persons.policy';
import { ListPersonsDto } from './dto/list-persons.dto';
import { PERSON_SORTING_MAP } from './dto/person-list-item.dto';
import { ListPersonsQuery } from './list-persons.query';

@QueryHandler(ListPersonsQuery)
export class ListPersonsHandler implements IQueryHandler<ListPersonsQuery, ListPersonsDto> {
    constructor(
        @InjectRepository(PersonEntity)
        private readonly repository: Repository<PersonEntity>,
        private readonly policy: ListPersonsPolicy,
        private readonly mapper: PersonMapper,
    ) {}

    async execute(query: ListPersonsQuery): Promise<ListPersonsDto> {
        if (!(await this.policy.canExecute(query))) {
            throw new ForbiddenException();
        }
        const qb = this.repository.createQueryBuilder('p');
        // search
        ApplyFiltersUtil.apply(qb, 'p', query.query.search);
        // filters
        ApplyFiltersUtil.apply(qb, 'p', query.query.filters);
        // sorting
        SortingUtils.apply(qb, query.query.sorting, PERSON_SORTING_MAP, { field: 'lastName', order: 'ASC' });
        // pagination
        const { page, limit } = PaginationUtils.apply(qb, query.query.page);
        const [rows, total] = await qb.getManyAndCount();
        return {
            items: rows.map(this.mapper.toListItemDto),
            page: {
                page,
                limit,
                total,
            },
        };
    }
}
