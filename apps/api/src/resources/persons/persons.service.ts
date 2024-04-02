import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonsService {
    constructor(
        @InjectRepository(Person)
        private personsRepository: Repository<Person>,
    ) {}

    async create(person: CreatePersonDto): Promise<Person> {
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
        const existing = this.personsRepository.findOne({ where });
        if (existing) {
            throw new BadRequestException(
                `Person '${person.firstName} ${person.lastName}' already exists.`,
            );
        }
        return await this.personsRepository.save(person);
    }

    async findAll(): Promise<Person[]> {
        return await this.personsRepository.find();
    }

    async findOne(id: number): Promise<Person> {
        const person = await this.personsRepository.findOneBy({ id });
        if (!person) {
            throw new NotFoundException(`Person could not be found.`);
        }
        return person;
    }

    async update(id: number, data: UpdatePersonDto): Promise<Person> {
        const person = await this.personsRepository.findOneBy({ id });
        if (!person) {
            throw new NotFoundException(`Person could not be found.`);
        }
        await this.personsRepository.save({ id, ...data });
        const updated = await this.personsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(id: number): Promise<Person> {
        const person = await this.personsRepository.findOneBy({ id });
        if (!person) {
            throw new NotFoundException(`Person could not be found.`);
        }
        await this.personsRepository.remove(person);
        return person;
    }
}
