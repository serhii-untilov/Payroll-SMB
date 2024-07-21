import { AccessType, ResourceType, RoleType } from '@/types';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    AvailableAccessDto,
    AvailableAccessUserCompanyDto,
    AvailableAccessUserDto,
    CreateAccessDto,
    UpdateAccessDto,
} from './dto';
import { Access } from './entities/access.entity';

@Injectable()
export class AccessService {
    public readonly resourceType = ResourceType.Access;

    constructor(
        @InjectRepository(Access)
        private repository: Repository<Access>,
    ) {}

    async create(userId: number, data: CreateAccessDto): Promise<Access> {
        const exists = await this.exists(data);
        if (exists) {
            throw new BadRequestException(`Access record already exists.`);
        }
        await this.availableForUserOrFail(userId, this.resourceType, AccessType.Create);
        return await this.repository.save({
            ...data,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(roleType: string, resourceType: string): Promise<Access[]> {
        const where = {};
        if (roleType) where['roleType'] = roleType;
        if (resourceType) where['resourceType'] = resourceType;
        return await this.repository.find(where);
    }

    async findOne(id: number) {
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: number, id: number, data: UpdateAccessDto): Promise<Access> {
        const record = this.repository.findOneBy({ id });
        if (!record) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        await this.availableForUserOrFail(userId, this.resourceType, AccessType.Update);
        await this.repository.save({ ...data, id, updatedUserId: userId, updatedDate: new Date() });
        return await this.repository.save({ id, ...data });
    }

    async remove(userId: number, id: number) {
        const record = await this.repository.findOne({ where: { id } });
        if (!record) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        await this.availableForUserOrFail(userId, this.resourceType, AccessType.Delete);
        return await this.repository.save({
            ...record,
            id,
            deletedDate: new Date(),
            deletedUserId: userId,
        });
    }

    async exists(params: AvailableAccessDto): Promise<boolean> {
        return await this.repository.exists({
            where: params,
        });
    }

    async available(params: AvailableAccessDto): Promise<boolean> {
        return await this.repository.exists({
            where: params,
        });
    }

    async availableForRoleTypeOrFail(
        roleType: RoleType,
        resourceType: ResourceType,
        accessType: AccessType,
    ): Promise<void> {
        if (!this.available({ roleType, resourceType, accessType })) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
    }

    async getUserRoleType(userId: number): Promise<RoleType> {
        try {
            const result: { type: RoleType }[] = await this.repository.query(
                `select r.type"
                from user
                inner join "role" r on r.id = user."roleId"
                where user."id" = $1`,
                [userId],
            );
            return result[0].type;
        } catch (e) {
            throw new NotFoundException(`User role not found. ${e}`);
        }
    }

    async availableForUser(params: AvailableAccessUserDto): Promise<boolean> {
        // const roleType = await this.usersService.getUserRoleTypeOrFail(params.userId);
        const roleType = await this.getUserRoleType(params.userId);
        return this.available({
            roleType,
            resourceType: params.resourceType,
            accessType: params.accessType,
        });
    }

    async availableForUserOrFail(
        userId: number,
        resourceType: ResourceType,
        accessType: AccessType,
    ): Promise<void> {
        if (!(await this.availableForUser({ userId, resourceType, accessType }))) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
    }

    async getUserCompanyRoleType(userId: number, companyId: number): Promise<RoleType | null> {
        try {
            const result: { type: RoleType }[] = await this.repository.query(
                `select r.type"
                from user_company uc
                inner join "role" r on r.id = uc."roleId"
                where uc."userId" = $1 and uc."companyId" = $2`,
                [userId, companyId],
            );
            return result[0].type;
        } catch (_e) {
            return null;
        }
    }

    async availableForUserCompany(params: AvailableAccessUserCompanyDto): Promise<boolean> {
        const roleType = await this.getUserCompanyRoleType(params.userId, params.companyId);
        if (!roleType) {
            return false;
        }
        return await this.available({
            roleType,
            resourceType: params.resourceType,
            accessType: params.accessType,
        });
    }

    async availableForUserCompanyOrFail(
        userId: number,
        companyId: number,
        resourceType: ResourceType,
        accessType: AccessType,
    ): Promise<void> {
        if (
            !(await this.availableForUserCompany({ userId, companyId, resourceType, accessType }))
        ) {
            throw new ForbiddenException(
                `User doesn't have access to the requested Company's resource.`,
            );
        }
    }

    canRegisterUserByRoleType(roleType: string): boolean {
        const canRegister = [RoleType.Employer, RoleType.Employee, RoleType.Guest];
        return canRegister.includes(roleType as RoleType);
    }

    canOperateRoleType(parentUserRoleType: string, childUserRoleType: string) {
        const whoMadeWho = [
            // ADMIN
            { parent: RoleType.Admin, child: RoleType.Admin },
            { parent: RoleType.Admin, child: RoleType.Employer },
            { parent: RoleType.Admin, child: RoleType.Observer },
            { parent: RoleType.Admin, child: RoleType.Employee },
            { parent: RoleType.Admin, child: RoleType.Guest },
            // EMPLOYER
            { parent: RoleType.Employer, child: RoleType.Employee },
            { parent: RoleType.Employer, child: RoleType.Observer },
            { parent: RoleType.Employer, child: RoleType.Employee },
            { parent: RoleType.Employer, child: RoleType.Guest },
        ];
        return (
            whoMadeWho.findIndex(
                (o) => o.parent === parentUserRoleType && o.child === childUserRoleType,
            ) >= 0
        );
    }
}
