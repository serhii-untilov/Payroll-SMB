import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Action, Resource } from '@/types';
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base';
import { UserAccessService } from '../user-access/user-access.service';
import { CreateWorkTimeNormDto } from './dto/create-work-time-norm.dto';
import { FindWorkTimeNormDto } from './dto/find-work-time-norm.dto';
import { UpdateWorkTimeNormDto } from './dto/update-work-time-norm.dto';
import { WorkTimeNorm } from './entities/work-time-norm.entity';

@Injectable()
export class WorkTimeNormService extends BaseUserAccess {
    public readonly resource = Resource.WorkTimeNorm;

    constructor(
        @InjectRepository(WorkTimeNorm) private repository: Repository<WorkTimeNorm>,
        @Inject(forwardRef(() => UserAccessService)) public userAccessService: UserAccessService,
    ) {
        super(userAccessService, Resource.WorkTimeNorm);
    }

    async create(userId: string, payload: CreateWorkTimeNormDto): Promise<string> {
        await this.canOrFail(userId, Action.Create);
        const exists = await this.repository.findOneBy({ name: payload.name });
        if (exists) {
            throw new HttpException(`WorkTimeNorm '${payload.name}' already exists.`, HttpStatus.CONFLICT);
        }
        const id = IdGenerator.nextId();
        await this.repository.save({
            ...payload,
            id,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return id;
    }

    async findAll(params?: FindWorkTimeNormDto) {
        return await this.repository.find({ relations: { days: !!params?.relations } });
    }

    async findOne(userId: string, id: string, params?: FindWorkTimeNormDto) {
        await this.canOrFail(userId, Action.Read, { resourceId: id });
        return await this.repository.findOneOrFail({
            relations: { days: !!params?.relations },
            where: { id },
        });
    }

    async update(userId: string, id: string, version: number, payload: UpdateWorkTimeNormDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, { resourceId: id });
        await this.repository.update(
            { id, version },
            {
                ...payload,
                updatedUserId: userId,
                updatedDate: new Date(),
            },
        );
        await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, { resourceId: id });
        await this.repository.update({ id, version }, { deletedDate: new Date(), deletedUserId: userId });
    }
}
