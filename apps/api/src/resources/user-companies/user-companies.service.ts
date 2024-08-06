import { ResourceType, RoleType, WrapperType } from '@/types';
import { checkVersionOrFail } from '@/utils';
import {
    ForbiddenException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvailableForUser } from '../abstract';
import { AccessService } from '../access/access.service';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { FindAllUserCompanyDto } from './dto/find-all-user-company.dto';
import { FindOneUserCompanyDto } from './dto/find-one-user-company.dto';
import { UpdateUserCompanyDto } from './dto/update-user-company.dto';
import { UserCompany } from './entities/user-company.entity';

@Injectable()
export class UserCompaniesService extends AvailableForUser {
    public readonly resourceType = ResourceType.Company;

    constructor(
        @InjectRepository(UserCompany)
        private repository: Repository<UserCompany>,
        @Inject(forwardRef(() => AccessService))
        public accessService: WrapperType<AccessService>,
    ) {
        super(accessService);
    }

    async create(userId: number, payload: CreateUserCompanyDto) {
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll({ userId, relations, withDeleted }: FindAllUserCompanyDto) {
        return await this.repository.find({
            where: { userId },
            relations: { company: relations, role: relations },
            withDeleted,
        });
    }

    async findOne(id: number, { relations, withDeleted }: FindOneUserCompanyDto) {
        const userCompany = this.repository.findOneOrFail({
            where: { id },
            relations: { company: relations, role: relations },
            withDeleted,
        });
        return userCompany;
    }

    async findOneByCompanyName(userId: number, name: string) {
        return await this.repository.findOne({
            relations: { company: true },
            where: { userId, company: { name } },
        });
    }

    async update(userId: number, id: number, payload: UpdateUserCompanyDto) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        await this.repository.save({
            id,
            ...payload,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<UserCompany> {
        await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async restore(userId: number, id: number): Promise<UserCompany> {
        await this.repository.save({
            id,
            deletedUserId: null,
            deletedDate: null,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async getUserCompanyRoleType(userId: number, companyId: number): Promise<RoleType> {
        const record = await this.repository.findOneOrFail({
            where: { userId, companyId },
            relations: { role: true },
        });
        if (!record.role?.type) {
            throw new NotFoundException('User role type not found.');
        }
        return record.role.type;
    }

    async getUserCompanyRoleTypeOrFail(userId: number, companyId: number): Promise<RoleType> {
        const roleType = await this.getUserCompanyRoleType(userId, companyId);
        if (!roleType) {
            throw new ForbiddenException(
                `User doesn't have access to the requested Company's resource.`,
            );
        }
        return roleType;
    }

    async count(userId: number, companyId: number): Promise<number> {
        const { count } = await this.repository
            .createQueryBuilder('user_company')
            .select('COUNT(*)', 'count')
            .where('"userId" = :userId', { userId })
            .andWhere('"companyId" = :companyId', { companyId })
            .andWhere('"deletedDate" is null')
            .getRawOne();
        return Number(count);
    }
}
