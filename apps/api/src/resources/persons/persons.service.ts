import { Resource } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { formatDate, monthBegin, monthEnd } from '@repo/shared';
import { Repository } from 'typeorm';
import { AvailableForUser } from '../abstract/available-for-user';
import { AccessService } from '../access/access.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { FindAllPersonDto } from './dto/find-all-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { PersonCreatedEvent } from './events/person-created.event';
import { PersonDeletedEvent } from './events/person-deleted.event';
import { PersonUpdatedEvent } from './events/person-updated.event';

@Injectable()
export class PersonsService extends AvailableForUser {
    public readonly resource = Resource.Person;

    constructor(
        @InjectRepository(Person)
        private repository: Repository<Person>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        private eventEmitter: EventEmitter2,
    ) {
        super(accessService);
    }

    async exists(params: FindAllPersonDto): Promise<boolean> {
        const { firstName, lastName, middleName, birthday, sex, taxId, email } = params;
        const found = await this.repository
            .createQueryBuilder('person')
            .where('"firstName" = :firstName', { firstName })
            .andWhere('"lastName" = :lastName', { lastName })
            .andWhere(middleName ? '"middleName" = :middleName' : '1=1', { middleName })
            .andWhere(birthday ? '"birthday" = :birthday' : '1=1', { birthday })
            .andWhere(sex ? '"sex" = :sex' : '1=1', { sex })
            .andWhere(taxId ? '"taxId" = :taxId' : '1=1', { taxId })
            .andWhere(email ? '"email" = :email' : '1=1', { email })
            .getRawMany();
        return !!found.length;
    }

    async create(userId: string, payload: CreatePersonDto): Promise<Person> {
        const exists = await this.exists(payload);
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

    async findOne(id: string): Promise<Person> {
        const person = await this.repository.findOneOrFail({ where: { id } });
        return person;
    }

    async update(userId: string, id: string, payload: UpdatePersonDto): Promise<Person> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        const updated = await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit('person.updated', new PersonUpdatedEvent(userId, updated.id));
        return updated;
    }

    async remove(userId: string, id: string): Promise<Person> {
        await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        const deleted = await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
        this.eventEmitter.emit('person.deleted', new PersonDeletedEvent(userId, id));
        return deleted;
    }

    async findByBirthdayInMonth(
        companyId: string,
        date: Date,
    ): Promise<{ id: string; birthday: Date }[]> {
        const dateFrom = monthBegin(date);
        const dateTo = monthEnd(date);
        const personList = await this.repository.query(
            `select p.id, p.birthday
             from person p
             where id in (select distinct p.id
                          from person p
                                   inner join position pos on
                              pos."personId" = p.id
                          where date_part('month',
                                          p.birthday) = date_part('month',
                                                                  to_date($1,
                                                                          'YYYY-MM-DD'))
                            and pos."companyId" = $3
                            and pos."dateFrom" <= to_date($2, 'YYYY-MM-DD')
                            and pos."dateTo" >= to_date($1, 'YYYY-MM-DD'))`,
            [formatDate(dateFrom), formatDate(dateTo), companyId],
        );
        // personList.forEach((o) => (o.birthday = new Date(o.birthday)));
        return personList.map((o) => {
            return { id: o.id, birthday: new Date(o.birthday) };
        });
    }
}
