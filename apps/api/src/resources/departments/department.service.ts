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
import { CreateDepartmentDto } from './dto/create-department.dto';
import { DepartmentReadDto } from './dto/department-read.dto';
import { ListDepartmentsQueryDto } from './dto/list-departments-query.dto';
import { ListDepartmentsDto } from './dto/list-departments.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentEntity } from './entities/department.entity';
import { DepartmentCreatedEvent } from './events/department-created.event';
import { DepartmentDeletedEvent } from './events/department-deleted.event';
import { DepartmentUpdatedEvent } from './events/department-updated.event';
import { DepartmentMapper } from './mappers/department.mapper';
import { DEPARTMENT_SORTING_MAP } from './dto/department-list-item.dto';

@Injectable()
export class DepartmentsService extends BaseUserAccess {
    constructor(
        @InjectRepository(DepartmentEntity) private repository: Repository<DepartmentEntity>,
        @Inject(forwardRef(() => UserAccessService)) public userAccess: UserAccessService,
        private eventEmitter: EventEmitter2,
        private readonly mapper: DepartmentMapper,
    ) {
        super(userAccess, Resource.Department);
    }

    async create(userId: string, dto: CreateDepartmentDto): Promise<string> {
        await this.canOrFail(userId, Action.Create);
        const id = IdGenerator.nextId();
        const department = await this.repository.save({ ...dto, id, createdUserId: userId, updatedUserId: userId });
        this.eventEmitter.emit(DepartmentCreatedEvent.name, new DepartmentCreatedEvent(userId, department.id));
        return department.id;
    }

    async update(userId: string, id: string, version: number, dto: UpdateDepartmentDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, id);
        await this.repository.update({ id, version }, { ...dto, updatedUserId: userId, updatedDate: new Date() });
        this.eventEmitter.emit(DepartmentUpdatedEvent.name, new DepartmentUpdatedEvent(userId, id));
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, id);
        await this.repository.update({ id, version }, { deletedUserId: userId, deletedDate: new Date() });
        this.eventEmitter.emit(DepartmentDeletedEvent.name, new DepartmentDeletedEvent(userId, id));
    }

    async findAll(userId: string, query: ListDepartmentsQueryDto): Promise<ListDepartmentsDto> {
        const qb = this.repository.createQueryBuilder('p').distinct(true);
        // search
        ApplyFiltersUtil.apply(qb, 'p', query.search);
        // filters
        ApplyFiltersUtil.apply(qb, 'p', query.filters);
        // sorting
        SortingUtils.apply(qb, query.sorting, DEPARTMENT_SORTING_MAP, { field: 'name', order: 'ASC' });

        // relations
        qb.innerJoinAndSelect('p.company', 'company')
            .innerJoin('company.users', 'users', 'users.userId = :userId', { userId })
            .leftJoinAndSelect('p.parentDepartment', 'parentDepartment');
        // pagination
        const { page, limit } = PaginationUtils.apply(qb, query.page);
        const [rows, total] = await qb.getManyAndCount();
        return {
            items: rows.map(this.mapper.toListItemDto),
            page: { page, limit, total },
        };
    }

    async findOne(userId: string, id: string): Promise<DepartmentReadDto> {
        const department = await this.repository
            .createQueryBuilder('d')
            .innerJoinAndSelect('d.company', 'c')
            .innerJoin('c.users', 'u')
            .leftJoinAndSelect('d.parentDepartment', 'pd')
            .where('d.id = :id', { id })
            .andWhere('u.id = :userId', { userId })
            .getOneOrFail();
        return this.mapper.toReadDto(department);
    }
}
