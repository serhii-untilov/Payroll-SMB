import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    forwardRef,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType, formatDate, monthBegin, monthEnd } from '@repo/shared';
import { Repository } from 'typeorm';
import { AvailableForUser } from '../abstract/availableForUser';
import { AccessService } from '../access/access.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { FindPersonDto } from './dto/find-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { PersonCreatedEvent } from './events/person-created.event';
import { PersonUpdatedEvent } from './events/person-updated.event';
import { PersonDeletedEvent } from './events/person-deleted.event';

@Injectable()
export class PersonsService extends AvailableForUser {
    public readonly resourceType = ResourceType.PERSON;

    constructor(
        @InjectRepository(Person)
        private repository: Repository<Person>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        private eventEmitter: EventEmitter2,
    ) {
        super(accessService);
    }

    async create(userId: number, payload: CreatePersonDto): Promise<Person> {
        const where: FindPersonDto[] = [
            {
                firstName: payload.firstName,
                lastName: payload.lastName,
                ...(payload.middleName ? { middleName: payload.middleName } : {}),
                ...(payload.birthday ? { birthday: payload.birthday } : {}),
                ...(payload.taxId ? { taxId: payload.taxId } : {}),
            },
        ];
        const exists = await this.repository.findOne({ where });
        if (exists) {
            throw new BadRequestException(
                `Person '${payload.firstName} ${payload.lastName}' already exists.`,
            );
        }
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        this.eventEmitter.emit('person.created', new PersonCreatedEvent(userId, created.id));
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(): Promise<Person[]> {
        return await this.repository.find();
    }

    async findOne(id: number): Promise<Person> {
        const person = await this.repository.findOneOrFail({ where: { id } });
        return person;
    }

    async update(userId: number, id: number, payload: UpdatePersonDto): Promise<Person> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        await this.repository.save({ ...payload, id, updatedUser: userId });
        const updated = await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit('person.updated', new PersonUpdatedEvent(userId, updated.id));
        return updated;
    }

    async remove(userId: number, id: number): Promise<Person> {
        await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        const deleted = await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
        this.eventEmitter.emit('person.deleted', new PersonDeletedEvent(userId, id));
        return deleted;
    }

    async findOneBy(params: FindPersonDto): Promise<Person | null> {
        return await this.repository.findOne({ where: params });
    }

    async findByBirthdayInMonth(companyId: number, date: Date): Promise<Person[]> {
        const dateFrom = monthBegin(date);
        const dateTo = monthEnd(date);
        const personList = await this.repository.query(
            `select p.id, p.birthday
            from person p
            where id in (
            select distinct p.id
            from
                person p
            inner join position pos on
                pos."personId" = p.id
            where
                date_part('month',
                p.birthday) = date_part('month',
                to_date($1,
                'YYYY-MM-DD'))
                and pos."companyId" = $3
                and pos."dateFrom" <= to_date($2, 'YYYY-MM-DD')
                and pos."dateTo" >= to_date($1, 'YYYY-MM-DD')
            )`,
            [formatDate(dateFrom), formatDate(dateTo), companyId],
        );
        personList.forEach((o) => (o.birthday = new Date(o.birthday)));
        return personList;
    }
}
