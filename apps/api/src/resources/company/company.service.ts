import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Action, Resource, RoleType } from '@/types';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base/user-access.abstract';
import { ApplyFiltersUtil } from '../common/db/apply-filters.util';
import { PaginationUtils } from '../common/db/pagination.utils';
import { SortingUtils } from '../common/db/sorting.utils';
import { RoleService } from '../role';
import { UserAccessService } from '../user-access/user-access.service';
import { UserRoleService } from '../user-role/user-role.service';
import { COMPANY_SORTABLE_FIELDS } from './dto/company-list-item.dto';
import { CompanyReadDto } from './dto/company-read.dto';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ListCompaniesQueryDto } from './dto/list-companies-query.dto';
import { ListCompaniesDto } from './dto/list-companies.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyEntity } from './entities/company.entity';
import { CalculateCompanyEvent } from './events/calculate-company.event';
import { CompanyCreatedEvent } from './events/company-created.event';
import { CompanyDeletedEvent } from './events/company-deleted.event';
import { CompanyUpdatedEvent } from './events/company-updated.event';
import { CompanyMapper } from './mappers/company.mapper';

@Injectable()
export class CompanyService extends BaseUserAccess {
    public readonly resource = Resource.Company;

    constructor(
        @InjectRepository(CompanyEntity) private repository: Repository<CompanyEntity>,
        @Inject(forwardRef(() => RoleService)) private roleService: RoleService,
        @Inject(forwardRef(() => UserRoleService)) private userRoleService: UserRoleService,
        readonly userAccess: UserAccessService,
        private readonly eventEmitter: EventEmitter2,
        private readonly mapper: CompanyMapper,
    ) {
        super(userAccess, Resource.Company);
    }
    async create(userId: string, dto: CreateCompanyDto): Promise<string> {
        await this.canOrFail(userId, Action.Create);
        const role = await this.roleService.findRoleByType(RoleType.CompanyAdmin);
        const id = IdGenerator.nextId();
        const company = await this.repository.save({ id, ...dto, createdUserId: userId, updatedUserId: userId });
        await this.userRoleService.create(userId, { userId, companyId: company.id, roleId: role.id });
        this.eventEmitter.emit(CompanyCreatedEvent.name, new CompanyCreatedEvent(userId, company.id));
        return company.id;
    }

    async update(userId: string, id: string, version: number, dto: UpdateCompanyDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, id);
        await this.repository.update(
            { id, version },
            {
                ...dto,
                updatedUserId: userId,
                updatedDate: new Date(),
            },
        );
        await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit(CompanyUpdatedEvent.name, new CompanyUpdatedEvent(userId, id));
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, id);
        await this.repository.update({ id, version }, { deletedDate: new Date(), deletedUserId: userId });
        this.eventEmitter.emit(CompanyDeletedEvent.name, new CompanyDeletedEvent(userId, id));
    }

    async findAll(userId: string, query: ListCompaniesQueryDto): Promise<ListCompaniesDto> {
        const qb = this.repository.createQueryBuilder('p').distinct(true);
        // search
        ApplyFiltersUtil.apply(qb, 'p', query.search);
        // filters
        ApplyFiltersUtil.apply(qb, 'p', query.filters);
        // sorting
        SortingUtils.apply(qb, 'p', query.sorting, COMPANY_SORTABLE_FIELDS, { field: 'id', order: 'ASC' });
        // relations
        qb.leftJoinAndSelect('p.law', 'law')
            .leftJoinAndSelect('p.accounting', 'accounting')
            .innerJoin('p.users', 'users', 'users.userId = :userId', { userId });
        // pagination
        const { page, limit } = PaginationUtils.apply(qb, query.page);
        const [rows, total] = await qb.getManyAndCount();
        return {
            items: rows.map(this.mapper.toListItemDto),
            page: { page, limit, total },
        };
    }

    async findOne(userId: string, id: string): Promise<CompanyReadDto> {
        const company = await this.repository.findOneOrFail({
            relations: {
                law: true,
                accounting: true,
                users: true,
            },
            where: {
                id,
                users: { userId },
            },
        });
        return this.mapper.toReadDto(company);
    }

    async findLast(userId: string): Promise<CompanyReadDto | undefined> {
        const raw = await this.repository
            .createQueryBuilder('company')
            .innerJoin('company.users', 'user')
            .select('MAX(company.id)', 'max')
            .where('user.userId = :userId', { userId })
            .getRawOne<{ max: string | null }>();

        if (!raw?.max) {
            return undefined;
        }

        return this.findOne(userId, raw.max);
    }

    async findOneOrFail(userId: string, id: string): Promise<CompanyReadDto> {
        return await this.findOne(userId, id);
    }

    async calculatePayroll(userId: string, id: string): Promise<void> {
        this.eventEmitter.emit('company.calculate', new CalculateCompanyEvent(userId, id));
    }
}
