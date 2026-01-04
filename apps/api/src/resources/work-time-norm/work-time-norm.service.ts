import { Action, Resource } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableForUser } from '../common/base/available-for-user';
import { AccessService } from '../access/access.service';
import { CreateWorkTimeNormDto } from './dto/create-work-time-norm.dto';
import { FindWorkTimeNormDto } from './dto/find-work-time-norm.dto';
import { UpdateWorkTimeNormDto } from './dto/update-work-time-norm.dto';
import { WorkTimeNorm } from './entities/work-time-norm.entity';

@Injectable()
export class WorkTimeNormService extends AvailableForUser {
    public readonly userRoleResource = Resource.WorkTimeNorm;

    constructor(
        @InjectRepository(WorkTimeNorm)
        private repository: Repository<WorkTimeNorm>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
    ) {
        super(accessService);
    }

    async create(userId: string, payload: CreateWorkTimeNormDto) {
        const exists = await this.repository.findOneBy({ name: payload.name });
        if (exists) {
            throw new HttpException(`WorkTimeNorm '${payload.name}' already exists.`, HttpStatus.CONFLICT);
        }
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return this.repository.findOneOrFail({ where: { id: created.id } });
    }

    async findAll(params?: FindWorkTimeNormDto) {
        return await this.repository.find({ relations: { days: !!params?.relations } });
    }

    async findOne(id: string, params?: FindWorkTimeNormDto) {
        return await this.repository.findOneOrFail({
            relations: { days: !!params?.relations },
            where: { id },
        });
    }

    async update(userId: string, id: string, payload: UpdateWorkTimeNormDto) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserOrFail(userId, this.userRoleResource, Action.Update);
        checkVersionOrFail(record, payload);
        const updated = await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return this.repository.findOneOrFail({ where: { id: updated.id } });
    }

    async remove(userId: string, id: string) {
        await this.repository.findOneOrFail({ where: { id } });
        await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        return this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }
}
