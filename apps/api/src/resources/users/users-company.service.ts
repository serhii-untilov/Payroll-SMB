import {
    ForbiddenException,
    Inject,
    Injectable,
    forwardRef,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType, RoleType } from '@/types';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { UpdateUserCompanyDto } from './dto/update-user-company.dto';
import { UserCompany } from './entities/user-company.entity';
import { FindAllUserCompanyDto } from './dto/find-all-user-company.dto';

@Injectable()
export class UsersCompanyService {
    public readonly resourceType = ResourceType.COMPANY;

    constructor(
        @InjectRepository(UserCompany)
        private repository: Repository<UserCompany>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreateUserCompanyDto): Promise<UserCompany> {
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

    async findAll(userId: number, relations: boolean): Promise<UserCompany[]> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.find({
            ...(relations ? { relations: { company: true, role: true } } : {}),
        });
    }

    async findOne(userId: number, id: number): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const userCompany = this.repository.findOneOrFail({ where: { id } });
        return userCompany;
    }

    async findOneByName(userId: number, name: string): Promise<UserCompany> {
        return await this.repository.findOneOrFail({
            relations: { company: true },
            where: { userId, company: { name } },
        });
    }

    async update(userId: number, id: number, payload: UpdateUserCompanyDto): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        await this.repository.save({
            id,
            ...payload,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        // re-query the database so that the updated record is returned
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async restore(userId: number, id: number): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        await this.repository.save({
            id,
            deletedUserId: null,
            deletedDate: null,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async getUserCompanyList(
        userId: number,
        id: number,
        params?: FindAllUserCompanyDto,
    ): Promise<UserCompany[]> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.find({
            where: { userId: id },
            withDeleted: !!params?.deleted,
            ...(!!params?.relations ? { relations: { company: true, role: true } } : {}),
        });
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
