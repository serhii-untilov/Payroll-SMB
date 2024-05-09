import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { FindPersonDto } from './dto/find-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonsService {
    public readonly resourceType = ResourceType.PERSON;

    constructor(
        @InjectRepository(Person)
        private repository: Repository<Person>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreatePersonDto): Promise<Person> {
        const where: FindPersonDto[] = [
            {
                firstName: payload.firstName,
                lastName: payload.lastName,
                ...(payload.middleName ? { middleName: payload.middleName } : {}),
                ...(payload.birthDate ? { birthDate: payload.birthDate } : {}),
                ...(payload.taxId ? { taxId: payload.taxId } : {}),
            },
        ];
        const exists = await this.repository.findOne({ where });
        if (exists) {
            throw new BadRequestException(
                `Person '${payload.firstName} ${payload.lastName}' already exists.`,
            );
        }
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.CREATE,
        );
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(userId: number): Promise<Person[]> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.find();
    }

    async findOne(userId: number, id: number): Promise<Person> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const person = await this.repository.findOneBy({ id });
        if (!person) {
            throw new NotFoundException(`Person could not be found.`);
        }
        return person;
    }

    async update(userId: number, id: number, payload: UpdatePersonDto): Promise<Person> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({ ...payload, id, updatedUser: userId });
    }

    async remove(userId: number, id: number): Promise<Person> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
    }

    async find(userId: number, params: FindPersonDto): Promise<Person | null> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.findOne({ where: params });
    }
}
