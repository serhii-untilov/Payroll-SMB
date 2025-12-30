import { Action, Resource, RoleType } from '@/types';
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCompany } from '../user-companies/entities/user-company.entity';
import { User } from '../users/entities/user.entity';
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
    public readonly resource = Resource.Access;

    constructor(
        @InjectRepository(Access)
        private repository: Repository<Access>,
        @InjectRepository(UserCompany)
        private userCompanyRepository: Repository<UserCompany>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async create(userId: string, data: CreateAccessDto): Promise<Access> {
        const exists = await this.exists(data);
        if (exists) {
            throw new BadRequestException(`Access record already exists.`);
        }
        await this.availableForUserOrFail(userId, this.resource, Action.Create);
        return await this.repository.save({
            ...data,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(roleType: string, resource: string): Promise<Access[]> {
        const where = {};
        if (roleType) where['roleType'] = roleType;
        if (resource) where['resource'] = resource;
        return await this.repository.find(where);
    }

    async findOne(id: string) {
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: string, id: string, data: UpdateAccessDto): Promise<Access> {
        const record = this.repository.findOneBy({ id });
        if (!record) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        await this.availableForUserOrFail(userId, this.resource, Action.Update);
        await this.repository.save({ ...data, id, updatedUserId: userId, updatedDate: new Date() });
        return await this.repository.save({ id, ...data });
    }

    async remove(userId: string, id: string) {
        const record = await this.repository.findOne({ where: { id } });
        if (!record) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        await this.availableForUserOrFail(userId, this.resource, Action.Delete);
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
        resource: Resource,
        action: Action,
    ): Promise<void> {
        if (!this.available({ roleType, resource, action })) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
    }

    async getUserRoleType(id: string): Promise<RoleType> {
        const user = await this.userRepository.findOneOrFail({
            where: { id },
            relations: { role: true },
        });
        if (!user?.role?.type) {
            throw new NotFoundException('User role type not found.');
        }
        return user.role.type;
    }

    async availableForUser(params: AvailableAccessUserDto): Promise<boolean> {
        const roleType = await this.getUserRoleType(params.userId);
        return this.available({
            roleType,
            resource: params.resource,
            action: params.action,
        });
    }

    async availableForUserOrFail(
        userId: string,
        resource: Resource,
        action: Action,
    ): Promise<void> {
        if (!(await this.availableForUser({ userId, resource, action }))) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
    }

    async getUserCompanyRoleType(userId: string, companyId: string): Promise<RoleType> {
        const record = await this.userCompanyRepository.findOneOrFail({
            where: { userId, companyId },
            relations: { role: true },
        });
        if (!record.role?.type) {
            throw new NotFoundException('User role type not found.');
        }
        return record.role.type;
    }

    async availableForUserCompany(params: AvailableAccessUserCompanyDto): Promise<boolean> {
        const roleType = await this.getUserCompanyRoleType(params.userId, params.companyId);
        if (!roleType) {
            return false;
        }
        return await this.available({
            roleType,
            resource: params.resource,
            action: params.action,
        });
    }

    async availableForUserCompanyOrFail(
        userId: string,
        companyId: string,
        resource: Resource,
        action: Action,
    ): Promise<void> {
        if (
            !(await this.availableForUserCompany({
                userId,
                companyId,
                resource,
                action,
            }))
        ) {
            throw new ForbiddenException(
                `User doesn't have access to the requested Company's resource.`,
            );
        }
    }

    canRegisterUserByRoleType(roleType: string): boolean {
        const canRegister = [RoleType.Accountant, RoleType.Employee, RoleType.Manager];
        return canRegister.includes(roleType as RoleType);
    }

    canOperateRoleType(parentUserRoleType: string, childUserRoleType: string) {
        const whoMadeWho = [
            // ADMIN
            { parent: RoleType.SystemAdmin, child: RoleType.SystemAdmin },
            { parent: RoleType.SystemAdmin, child: RoleType.Accountant },
            { parent: RoleType.SystemAdmin, child: RoleType.Manager },
            { parent: RoleType.SystemAdmin, child: RoleType.Employee },
            { parent: RoleType.SystemAdmin, child: RoleType.Manager },
            // EMPLOYER
            { parent: RoleType.Accountant, child: RoleType.Employee },
            { parent: RoleType.Accountant, child: RoleType.Manager },
            { parent: RoleType.Accountant, child: RoleType.Employee },
            { parent: RoleType.Accountant, child: RoleType.Manager },
        ];
        return (
            whoMadeWho.findIndex(
                (o) => o.parent === parentUserRoleType && o.child === childUserRoleType,
            ) >= 0
        );
    }
}
