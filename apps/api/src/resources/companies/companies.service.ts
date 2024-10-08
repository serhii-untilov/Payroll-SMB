import { AccessType, ResourceType } from '@/types';
import { checkVersionOrFail } from '@/utils';
import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { UserCompaniesService } from '../user-companies/user-companies.service';
import { UsersService } from '../users/users.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { CompanyCalculateEvent } from './events/company-calculate.event';
import { CompanyCreatedEvent } from './events/company-created.event';
import { CompanyDeletedEvent } from './events/company-deleted.event';
import { CompanyUpdatedEvent } from './events/company-updated.event';

@Injectable()
export class CompaniesService {
    private _logger: Logger = new Logger(CompaniesService.name);
    public readonly resourceType = ResourceType.Company;

    constructor(
        @InjectRepository(Company)
        private repository: Repository<Company>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => UserCompaniesService))
        private usersCompanyService: UserCompaniesService,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
        private eventEmitter: EventEmitter2,
    ) {}

    async availableFindAllOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Access,
        );
    }

    async availableFindOneOrFail(userId: number, id: number) {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            id,
            this.resourceType,
            AccessType.Access,
        );
    }

    async availableCreateOrFail(userId: number) {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Create,
        );
    }

    async availableUpdateOrFail(userId: number, id: number) {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            id,
            this.resourceType,
            AccessType.Update,
        );
    }

    async availableDeleteOrFail(userId: number, id: number) {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            id,
            this.resourceType,
            AccessType.Delete,
        );
    }

    async create(userId: number, payload: CreateCompanyDto): Promise<Company> {
        const existing = await this.usersCompanyService.findOneByCompanyName(userId, payload.name);
        if (existing) {
            throw new BadRequestException(`Company '${payload.name}' already exists.`);
        }
        const record = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        const user = await this.usersService.findOneOrFail({ where: { id: userId } });
        if (!user || !user.roleId) {
            throw new NotFoundException('User or Role not found.');
        }
        await this.usersCompanyService.create(userId, {
            userId,
            companyId: record.id,
            roleId: user.roleId,
        });
        const created = await this.repository.findOneOrFail({ where: { id: record.id } });
        this.eventEmitter.emit('company.created', new CompanyCreatedEvent(userId, created));
        return created;
    }

    async findAll(userId: number, relations: boolean): Promise<Company[]> {
        return await this.repository.find({
            relations: {
                law: relations,
                accounting: relations,
                users: true,
            },
            where: {
                users: { userId },
            },
        });
    }

    async findOne(userId: number, id: number, relations: boolean = false): Promise<Company> {
        const company = await this.repository.findOneOrFail({
            relations: {
                law: !!relations,
                accounting: !!relations,
                users: true,
            },
            where: {
                id,
                users: { userId },
            },
        });
        return company;
    }

    async findLast(userId: number, relations: boolean = false): Promise<Company | undefined> {
        const companies = await this.findAll(userId, relations);
        const id = companies.reduce((a, b) => (a && a > b.id ? a : b.id), 0);
        return companies.find((o) => o.id === id);
    }

    async findOneOrFail(userId: number, id: number, relations: boolean = false): Promise<Company> {
        const company = await this.findOne(userId, id, relations);
        if (!company) {
            throw new NotFoundException(`Company could not be found or user doesn't have access.`);
        }
        return company;
    }

    async update(userId: number, id: number, payload: UpdateCompanyDto): Promise<Company> {
        await this.usersCompanyService.getUserCompanyRoleTypeOrFail(userId, id);
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        const updated = await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit('company.updated', new CompanyUpdatedEvent(userId, updated));
        return updated;
    }

    async remove(userId: number, id: number): Promise<Company> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (record.createdUserId === userId) {
            await this.repository.save({ id, deletedDate: new Date(), deletedUserId: userId });
            const deleted = await this.repository.findOneOrFail({
                where: { id },
                withDeleted: true,
            });
            this.eventEmitter.emit('company.deleted', new CompanyDeletedEvent(userId, deleted));
            return deleted;
        }
        throw new ForbiddenException(
            `User doesn't have access to the requested Company's resource.`,
        );
    }

    async calculatePayroll(userId: number, id: number): Promise<void> {
        const company = await this.repository.findOneOrFail({ where: { id } });
        this.eventEmitter.emit('company.calculate', new CompanyCalculateEvent(userId, company));
    }
}
