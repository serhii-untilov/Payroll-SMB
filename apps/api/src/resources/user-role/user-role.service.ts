import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Resource, RoleType } from '@/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { FindUserRoleDto } from './dto/find-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UserRoleService {
    public readonly userRoleResource = Resource.Company;

    constructor(@InjectRepository(UserRole) private repository: Repository<UserRole>) {}

    async create(userId: string, payload: CreateUserRoleDto) {
        return await this.repository.save({
            id: IdGenerator.nextId(),
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll({ userId, relations, withDeleted }: FindUserRoleDto) {
        return await this.repository.find({
            where: { userId },
            relations: { company: relations, role: relations },
            withDeleted,
        });
    }

    async findOne(id: string, { relations, withDeleted }: FindUserRoleDto) {
        const userCompany = this.repository.findOneOrFail({
            where: { id },
            relations: { company: relations, role: relations },
            withDeleted,
        });
        return userCompany;
    }

    async findOneByCompanyName(userId: string, name: string) {
        return await this.repository.findOne({
            relations: { company: true },
            where: { userId, company: { name } },
        });
    }

    async update(userId: string, id: string, payload: UpdateUserRoleDto) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        await this.repository.save({
            id,
            ...payload,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: string, id: string): Promise<UserRole> {
        await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id }, withDeleted: true });
    }

    async restore(userId: string, id: string): Promise<UserRole> {
        await this.repository.save({
            id,
            deletedUserId: null,
            deletedDate: null,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async hasGlobalRole(userId: string, roleType: RoleType): Promise<boolean> {
        return (await this.repository.exists({
            where: {
                userId,
                role: {
                    type: roleType,
                },
                companyId: IsNull(),
            },
        })) as boolean;
    }

    async hasCompanyRole(userId: string, companyId: string, roleType: RoleType): Promise<boolean> {
        return (await this.repository.exists({
            where: {
                userId,
                companyId,
                role: {
                    type: roleType,
                },
            },
        })) as boolean;
    }

    async getUserCompanyRoleType(userId: string, companyId: string): Promise<RoleType> {
        const record = await this.repository.findOneOrFail({
            where: { userId, companyId },
            relations: { role: true },
        });
        if (!record.role?.type) {
            throw new NotFoundException('User role type not found.');
        }
        return record.role.type;
    }

    async getUserCompanyRoleTypeOrFail(userId: string, companyId: string): Promise<RoleType> {
        const roleType = await this.getUserCompanyRoleType(userId, companyId);
        if (!roleType) {
            throw new ForbiddenException(`User doesn't have access to the requested Company's resource.`);
        }
        return roleType;
    }

    async count(userId: string, companyId: string): Promise<number> {
        const { count } = await this.repository
            .createQueryBuilder('user_company')
            .select('COUNT(*)', 'count')
            .where('"userId" = :userId', { userId })
            .andWhere('"companyId" = :companyId', { companyId })
            .andWhere('"deletedDate" is null')
            .getRawOne();
        return Number(count);
    }

    async findAllByRoleType({ roleType, relations, withDeleted }: FindUserRoleDto) {
        return await this.repository.find({
            where: {
                role: {
                    type: roleType,
                },
                user: {
                    isActive: true,
                    deletedDate: IsNull(),
                },
                company: {
                    deletedDate: IsNull(),
                },
            },
            relations: { company: relations, role: relations },
            withDeleted,
        });
    }
}
