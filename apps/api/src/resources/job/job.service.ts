import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Action, Resource } from '@/types';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base/user-access.abstract';
import { ApplyFiltersUtil } from '../common/db/apply-filters.util';
import { PaginationUtils } from '../common/db/pagination.utils';
import { SortingUtils } from '../common/db/sorting.utils';
import { UserAccessService } from '../user-access';
import { CreateJobDto } from './dto/create-job.dto';
import { JobReadDto } from './dto/job-read.dto';
import { ListJobsQueryDto } from './dto/list-jobs-query.dto';
import { ListJobsDto } from './dto/list-jobs.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobEntity } from './entities/job.entity';
import { JobCreatedEvent } from './events/job-created.event';
import { JobDeletedEvent } from './events/job-deleted.event';
import { JobRestoredEvent } from './events/job-restored.event';
import { JobUpdatedEvent } from './events/job-updated.event';
import { JobMapper } from './mappers/job.mapper';

@Injectable()
export class JobService extends BaseUserAccess {
    constructor(
        @InjectRepository(JobEntity) private repository: Repository<JobEntity>,
        @Inject(forwardRef(() => UserAccessService)) userAccess: UserAccessService,
        private eventEmitter: EventEmitter2,
        private readonly mapper: JobMapper,
    ) {
        super(userAccess, Resource.Job);
    }

    async create(userId: string, dto: CreateJobDto): Promise<string> {
        await this.canOrFail(userId, Action.Create);
        const id = IdGenerator.nextId();
        const job = await this.repository.save({ ...dto, id, createdUserId: userId, updatedUserId: userId });
        this.eventEmitter.emit(JobCreatedEvent.name, new JobCreatedEvent(userId, job.id));
        return job.id;
    }

    async update(userId: string, id: string, version: number, dto: UpdateJobDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, { resourceId: id });
        await this.repository.update({ id, version }, { ...dto, updatedUserId: userId, updatedDate: new Date() });
        this.eventEmitter.emit(JobUpdatedEvent.name, new JobUpdatedEvent(userId, id));
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, { resourceId: id });
        await this.repository.update({ id, version }, { deletedUserId: userId, deletedDate: new Date() });
        this.eventEmitter.emit(JobDeletedEvent.name, new JobDeletedEvent(userId, id));
    }

    async restore(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Restore, { resourceId: id });
        await this.repository.update({ id, version }, { deletedUserId: null, deletedDate: null });
        this.eventEmitter.emit(JobRestoredEvent.name, new JobRestoredEvent(userId, id));
    }

    async findAll(userId: string, query: ListJobsQueryDto): Promise<ListJobsDto> {
        await this.canOrFail(userId, Action.Read);
        const qb = this.repository.createQueryBuilder('d').distinct(true);

        // search
        ApplyFiltersUtil.apply(qb, 'd', query.search);

        // filters
        ApplyFiltersUtil.apply(qb, 'd', query.filters);

        // sorting
        const JOB_SORTING_MAP = {
            name: 'd.name',
        } as const;
        SortingUtils.apply(qb, query.sorting, JOB_SORTING_MAP, { field: 'name', order: 'ASC' });

        // pagination
        const { page, limit } = PaginationUtils.apply(qb, query.page);
        const [rows, total] = await qb.getManyAndCount();

        return {
            items: rows.map(this.mapper.toListItemDto),
            page: { page, limit, total },
        };
    }

    async findOne(userId: string, id: string): Promise<JobReadDto> {
        await this.canOrFail(userId, Action.Read, { resourceId: id });
        const job = await this.repository.createQueryBuilder('d').where('d.id = :id', { id }).getOneOrFail();
        return this.mapper.toReadDto(job);
    }
}
