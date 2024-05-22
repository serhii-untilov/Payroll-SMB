import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
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

    async availableFindAllOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableFindOneOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
    }

    async availableCreateOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.CREATE,
        );
    }

    async availableUpdateOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
    }

    async availableDeleteOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
    }

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
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
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
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<Person> {
        await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async find(params: FindPersonDto): Promise<Person | null> {
        return await this.repository.findOne({ where: params });
    }
}
