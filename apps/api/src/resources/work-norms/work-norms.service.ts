import { AccessType, ResourceType } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableForUser } from '../abstract/availableForUser';
import { AccessService } from '../access/access.service';
import { CreateWorkNormDto } from './dto/create-work-norm.dto';
import { FindWorkNormDto } from './dto/find-work-norm.dto';
import { UpdateWorkNormDto } from './dto/update-work-norm.dto';
import { WorkNorm } from './entities/work-norm.entity';

@Injectable()
export class WorkNormsService extends AvailableForUser {
    public readonly resourceType = ResourceType.WorkNorm;

    constructor(
        @InjectRepository(WorkNorm)
        private repository: Repository<WorkNorm>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
    ) {
        super(accessService);
    }

    async create(userId: number, payload: CreateWorkNormDto) {
        const exists = await this.repository.findOneBy({ name: payload.name });
        if (exists) {
            throw new HttpException(
                `WorkNorm '${payload.name}' already exists.`,
                HttpStatus.CONFLICT,
            );
        }
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(params?: FindWorkNormDto) {
        return await this.repository.find({ relations: { periods: !!params?.relations } });
    }

    async findOne(id: number, params?: FindWorkNormDto) {
        return await this.repository.findOneOrFail({
            relations: { periods: !!params?.relations },
            where: { id },
        });
    }

    async update(userId: number, id: number, payload: UpdateWorkNormDto) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Update,
        );
        checkVersionOrFail(record, payload);
        const updated = await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return this.repository.findOneOrFail({ where: { id: updated.id } });
    }

    async remove(userId: number, id: number) {
        await this.repository.findOneOrFail({ where: { id } });
        await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        return this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }
}
