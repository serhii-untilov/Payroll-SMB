import { RoleType } from '@/types';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class RoleQueryService {
    constructor(@InjectRepository(UserRole) private repository: Repository<UserRole>) {}

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

    async findOneByCompanyName(userId: string, name: string) {
        return await this.repository.findOne({
            relations: { company: true },
            where: { userId, company: { name } },
        });
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
}
