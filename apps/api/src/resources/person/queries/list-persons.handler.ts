import { ApplyFiltersUtil } from '@/resources/common/db/apply-filters.util';
import { SortingUtils } from '@/resources/common/db/sorting.utils';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonEntity } from '../entities/person.entity';
import { PersonMapper } from '../mappers/person.mapper';
import { ListPersonsDto } from './dto/list-persons.dto';
import { PERSON_SORTABLE_FIELDS } from './dto/person-list-item.dto';
import { ListPersonsQuery } from './list-persons.query';

@QueryHandler(ListPersonsQuery)
export class ListPersonsHandler implements IQueryHandler<ListPersonsQuery, ListPersonsDto> {
    constructor(
        @InjectRepository(PersonEntity)
        private readonly repo: Repository<PersonEntity>,
    ) {}

    async execute(query: ListPersonsQuery): Promise<ListPersonsDto> {
        const qb = this.repo.createQueryBuilder('p');

        // search
        ApplyFiltersUtil.apply(qb, 'p', query.search);

        // filters
        ApplyFiltersUtil.apply(qb, 'p', query.filters);

        // sorting
        SortingUtils.apply(qb, 'p', query.sorting, PERSON_SORTABLE_FIELDS, {
            field: 'id',
            order: 'ASC',
        });

        // pagination
        const page = query.page?.page ?? 1;
        const limit = query.page?.limit ?? 20;
        const offset = (page - 1) * limit;
        qb.take(limit).skip(offset);

        const [rows, total] = await qb.getManyAndCount();

        return {
            items: rows.map(PersonMapper.toListItem),
            page: {
                page,
                limit,
                total,
            },
        };
    }
}
