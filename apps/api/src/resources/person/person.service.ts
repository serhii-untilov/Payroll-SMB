import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Action, Resource } from '@/types';
import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base/user-access.abstract';
import { ApplyFiltersUtil } from '../common/db/apply-filters.util';
import { PaginationUtils } from '../common/db/pagination.utils';
import { SortingUtils } from '../common/db/sorting.utils';
import { UserAccessService } from '../user-access/user-access.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { ListPersonsQueryDto } from './dto/list-persons-query.dto';
import { ListPersonsDto } from './dto/list-persons.dto';
import { PersonReadDto } from './dto/person-read.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { PersonEntity } from './entities/person.entity';
import { PersonCreatedEvent } from './events/person-created.event';
import { PersonDeletedEvent } from './events/person-deleted.event';
import { PersonRestoredEvent } from './events/person-restored.event';
import { PersonUpdatedEvent } from './events/person-updated.event';
import { PersonMapper } from './mappers/person.mapper';

@Injectable()
export class PersonService extends BaseUserAccess {
    public readonly resource = Resource.Person;

    constructor(
        @InjectRepository(PersonEntity) private repository: Repository<PersonEntity>,
        @Inject(forwardRef(() => UserAccessService)) readonly userAccess: UserAccessService,
        private readonly eventEmitter: EventEmitter2,
        private readonly mapper: PersonMapper,
    ) {
        super(userAccess, Resource.Person);
    }

    async create(userId: string, dto: CreatePersonDto): Promise<string> {
        await this.canOrFail(userId, Action.Create);
        const person = this.mapper.toEntity(dto);
        person.createdUserId = userId;
        person.updatedUserId = userId;
        person.id = IdGenerator.nextId();
        await this.repository.save(person);
        const changes = this.mapper.diff(new PersonEntity() as any, dto as any);
        this.eventEmitter.emit(PersonCreatedEvent.name, new PersonCreatedEvent(userId, person.id, changes as any));
        return person.id;
    }

    async update(userId: string, id: string, version: number, dto: UpdatePersonDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, { resourceId: id });
        const personBefore = await this.repository.findOneByOrFail({ id });
        const changes = this.mapper.diff(personBefore as any, dto as any);
        const result = await this.repository.update(
            { id, version },
            { ...this.mapper.toPartial(dto), updatedUserId: userId },
        );
        if (result.affected === 0) {
            throw new ConflictException('Person was modified by another user');
        }
        this.eventEmitter.emit(PersonUpdatedEvent.name, new PersonUpdatedEvent(userId, id, changes as any));
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, { resourceId: id });
        const personBefore = await this.repository.findOneByOrFail({ id });
        const changes = this.mapper.diff(personBefore as any, {} as any);
        const result = await this.repository.update(
            { id, version },
            { deletedDate: new Date(), deletedUserId: userId },
        );
        if (result.affected === 0) {
            throw new ConflictException('Person was modified or already deleted');
        }
        this.eventEmitter.emit(PersonDeletedEvent.name, new PersonDeletedEvent(userId, id, changes as any));
    }

    async restore(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Restore, { resourceId: id });
        const personBefore = await this.repository.findOneOrFail({
            where: { id },
            withDeleted: true,
        });
        const personAfter = this.mapper.toReadDto(personBefore);
        const changes = this.mapper.diff(personBefore as any, personAfter as any);
        const result = await this.repository.update({ id, version }, { deletedDate: null, deletedUserId: null });
        if (result.affected === 0) {
            throw new ConflictException('Person was modified or already restored');
        }
        this.eventEmitter.emit(PersonRestoredEvent.name, new PersonRestoredEvent(userId, id, changes as any));
    }

    async findAll(userId: string, query: ListPersonsQueryDto): Promise<ListPersonsDto> {
        await this.canOrFail(userId, Action.Read);
        const qb = this.repository.createQueryBuilder('p');

        // search
        ApplyFiltersUtil.apply(qb, 'p', query.search);

        // filters
        ApplyFiltersUtil.apply(qb, 'p', query.filters);

        // sorting
        const PERSON_SORTING_MAP = {
            firstName: 'firstName',
            lastName: 'lastName',
            middleName: 'middleName',
            fullName: 'fullName',
            birthDate: 'birthDate',
            taxId: 'taxId',
            gender: 'gender',
            phone: 'phone',
            email: 'email',
        } as const;
        SortingUtils.apply(qb, query.sorting, PERSON_SORTING_MAP, { field: 'lastName', order: 'ASC' });

        // pagination
        const { page, limit } = PaginationUtils.apply(qb, query.page);
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

    async findOne(userId: string, id: string): Promise<PersonReadDto> {
        await this.canOrFail(userId, Action.Read, { resourceId: id });
        const person = await this.repository.findOneByOrFail({ id });
        return this.mapper.toReadDto(person);
    }

    async findByBirthdayInMonth(companyId: string, date: Date): Promise<PersonEntity[]> {
        // Find persons with birthdays in the same month as the given date
        const month = date.getMonth() + 1; // JavaScript months are 0-indexed
        return this.repository
            .createQueryBuilder('p')
            .innerJoin('p.positions', 'pos')
            .where('pos.companyId = :companyId', { companyId })
            .andWhere('EXTRACT(MONTH FROM p.birthDate) = :month', { month })
            .getMany();
    }
}
