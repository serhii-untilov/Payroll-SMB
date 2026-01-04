import { Resource } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { maxDate, minDate } from '@repo/shared';
import { Repository } from 'typeorm';
import { AvailableForUserCompany } from '../common/base/available-for-user-company';
import { AccessService } from '../access/access.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { FindAllDepartmentDto } from './dto/find-all-department.dto';
import { FindOneDepartmentDto } from './dto/find-one-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { DepartmentCreatedEvent } from './events/department-created.event';
import { DepartmentDeletedEvent } from './events/department-deleted.event';
import { DepartmentUpdatedEvent } from './events/department-updated.event';

@Injectable()
export class DepartmentsService extends AvailableForUserCompany {
    public readonly resource = Resource.Department;

    constructor(
        @InjectRepository(Department)
        private repository: Repository<Department>,
        @Inject(forwardRef(() => AccessService))
        public accessService: AccessService,
        private eventEmitter: EventEmitter2,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: string): Promise<string> {
        return (
            await this.repository.findOneOrFail({
                select: { companyId: true },
                where: { id: entityId },
                withDeleted: true,
            })
        ).companyId;
    }

    async create(userId: string, payload: CreateDepartmentDto): Promise<Department> {
        const { dateFrom, dateTo, ...other } = payload;
        const existing = await this.repository.findOneBy({
            companyId: payload.companyId,
            name: payload.name,
        });
        if (existing) {
            throw new HttpException(`Department '${payload.name}' already exists.`, HttpStatus.CONFLICT);
        }
        const created = await this.repository.save({
            ...other,
            dateFrom: dateFrom ?? minDate(),
            dateTo: dateTo ?? maxDate(),
            createdUserId: userId,
            updatedUserId: userId,
        });
        this.eventEmitter.emit('department.created', new DepartmentCreatedEvent(userId, created));
        return created;
    }

    async findAll(params: FindAllDepartmentDto): Promise<Department[]> {
        return await this.repository.find({
            relations: {
                company: !!params?.relations,
                parentDepartment: !!params?.relations,
                childDepartments: !!params?.relations,
            },
            where: { companyId: params.companyId },
        });
    }

    async findOne(id: string, params?: FindOneDepartmentDto): Promise<Department> {
        return await this.repository.findOneOrFail({
            relations: {
                company: !!params?.relations,
                parentDepartment: !!params?.relations,
                childDepartments: !!params?.relations,
            },
            where: { id },
        });
    }

    async update(userId: string, id: string, payload: UpdateDepartmentDto): Promise<Department> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        const updated = await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit('department.updated', new DepartmentUpdatedEvent(userId, updated));
        return updated;
    }

    async remove(userId: string, id: string): Promise<Department> {
        await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
        const deleted = await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
        this.eventEmitter.emit('department.deleted', new DepartmentDeletedEvent(userId, deleted));
        return deleted;
    }

    async count(companyId: string): Promise<number> {
        const { count } = await this.repository
            .createQueryBuilder('department')
            .select('COUNT(*)', 'count')
            .where('"companyId" = :companyId', { companyId })
            .andWhere('"deletedDate" is null')
            .getRawOne();
        return Number(count);
    }
}
