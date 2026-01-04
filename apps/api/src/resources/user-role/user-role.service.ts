import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Action, Resource, RoleType } from '@/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { FindUserRoleDto } from './dto/find-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './entities/user-role.entity';
import { BaseUserAccess } from '../common/base/user-access.abstract';
import { UserAccessService } from '../user-access/user-access.service';

@Injectable()
export class UserRoleService extends BaseUserAccess {
    public readonly userRoleResource = Resource.Company;

    constructor(
        @InjectRepository(UserRole) private repository: Repository<UserRole>,
        readonly userAccess: UserAccessService,
    ) {
        super(userAccess, Resource.UserRole);
    }

    async create(userId: string, dto: CreateUserRoleDto): Promise<string> {
        await this.canOrFail(userId, Action.Create);
        const id = IdGenerator.nextId();
        await this.repository.save({ id, ...dto, createdUserId: userId, updatedUserId: userId });
        return id;
    }

    async update(userId: string, id: string, version: number, payload: UpdateUserRoleDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, id);
        await this.repository.update({ id, version }, { ...payload, updatedUserId: userId, updatedDate: new Date() });
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, id);
        await this.repository.update({ id, version }, { deletedUserId: userId, deletedDate: new Date() });
    }

    async restore(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Restore, id);
        await this.repository.update({ id, version }, { deletedUserId: null, deletedDate: null });
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
