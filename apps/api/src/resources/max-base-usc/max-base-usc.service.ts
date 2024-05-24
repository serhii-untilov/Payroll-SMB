import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateMaxBaseUscDto } from './dto/create-max-base-usc.dto';
import { UpdateMaxBaseUscDto } from './dto/update-max-base-usc.dto';
import { AccessType, ResourceType } from '@repo/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { MaxBaseUSC } from './entities/max-base-usc.entity';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';

@Injectable()
export class MaxBaseUscService {
    readonly resourceType = ResourceType.MAX_BASE_UFC;

    constructor(
        @InjectRepository(MaxBaseUSC)
        private repository: Repository<MaxBaseUSC>,
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

    async create(userId: number, payload: CreateMaxBaseUscDto): Promise<MaxBaseUSC> {
        const created = await this.repository.create({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return await this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(): Promise<MaxBaseUSC[]> {
        return await this.repository.find();
    }

    async findOne(id: number): Promise<MaxBaseUSC> {
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: number, id: number, payload: UpdateMaxBaseUscDto): Promise<MaxBaseUSC> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        await this.repository.save({ ...payload, id, updatedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<MaxBaseUSC> {
        await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }
}
