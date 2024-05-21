import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateWorkNormDto } from './dto/create-work-norm.dto';
import { UpdateWorkNormDto } from './dto/update-work-norm.dto';
import { WorkNorm } from './entities/work-norm.entity';

@Injectable()
export class WorkNormsService {
    public readonly resourceType = ResourceType.WORK_NORM;

    constructor(
        @InjectRepository(WorkNorm)
        private repository: Repository<WorkNorm>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreateWorkNormDto): Promise<WorkNorm> {
        const existing = await this.repository.findOneBy({ name: payload.name });
        if (existing) {
            throw new ConflictException(`WorkNorm '${payload.name}' already exists.`);
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

    async findAll(relations: boolean): Promise<WorkNorm[]> {
        return await this.repository.find({ relations: { periods: relations } });
    }

    async findOne(id: number, relations: boolean): Promise<WorkNorm> {
        return await this.repository.findOneOrFail({
            relations: { periods: relations },
            where: { id },
        });
    }

    async update(userId: number, id: number, payload: UpdateWorkNormDto): Promise<WorkNorm> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        return await this.repository.save({ ...payload, id, updatedUserId: userId });
    }

    async remove(userId: number, id: number): Promise<WorkNorm> {
        await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        return await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
    }
}
