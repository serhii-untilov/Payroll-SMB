import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { AccessService } from '../access/access.service';
import { AccessType, ResourceType } from '@repo/shared';

@Injectable()
export class PersonsService {
    constructor(
        @InjectRepository(Person)
        private personsRepository: Repository<Person>,
        private readonly usersService: UsersService,
        private readonly accessService: AccessService,
        public readonly resourceType: ResourceType.PERSON,
    ) {}

    async create(userId: number, person: CreatePersonDto): Promise<Person> {
        const where: UpdatePersonDto[] = [
            {
                firstName: person.firstName,
                lastName: person.lastName,
                ...(person.middleName ? { middleName: person.middleName } : {}),
                ...(person.birthDate ? { birthDate: person.birthDate } : {}),
            },
        ];
        if (person.taxId) {
            where.push({
                taxId: person.taxId,
            });
        }
        const existing = await this.personsRepository.findOne({ where });
        if (existing) {
            throw new BadRequestException(
                `Person '${person.firstName} ${person.lastName}' already exists.`,
            );
        }
        const roleType = await this.usersService.getUserRoleTypeOrException(userId);
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.CREATE);
        return await this.personsRepository.save(person);
    }

    async findAll(userId: number): Promise<Person[]> {
        const roleType = await this.usersService.getUserRoleTypeOrException(userId);
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.ACCESS);
        return await this.personsRepository.find();
    }

    async findOne(userId: number, id: number): Promise<Person> {
        const roleType = await this.usersService.getUserRoleTypeOrException(userId);
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.ACCESS);
        const person = await this.personsRepository.findOneBy({ id });
        if (!person) {
            throw new NotFoundException(`Person could not be found.`);
        }
        return person;
    }

    async update(userId: number, id: number, data: UpdatePersonDto): Promise<Person> {
        const roleType = await this.usersService.getUserRoleTypeOrException(userId);
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.UPDATE);
        const person = await this.personsRepository.findOneBy({ id });
        if (!person) {
            throw new NotFoundException(`Person could not be found.`);
        }
        await this.personsRepository.save({ id, ...data });
        const updated = await this.personsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<Person> {
        const roleType = await this.usersService.getUserRoleTypeOrException(userId);
        this.accessService.availableOrException(roleType, this.resourceType, AccessType.DELETE);
        const person = await this.personsRepository.findOneBy({ id });
        if (!person) {
            throw new NotFoundException(`Person could not be found.`);
        }
        const deleted = {
            ...person,
            deletedDate: new Date(),
            deletedUserId: userId,
        } as Person;
        await this.personsRepository.save(deleted);
        return deleted;
    }
}
