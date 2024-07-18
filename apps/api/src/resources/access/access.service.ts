import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType, RoleType } from '@/types';
import { Repository } from 'typeorm';
import { UsersCompanyService } from '../users/users-company.service';
import { UsersService } from '../users/users.service';
import {
    AvailableAccessDto,
    AvailableAccessUserCompanyDto,
    AvailableAccessUserDto,
} from './dto/available-access.dto';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { Access } from './entities/access.entity';
import { WrapperType } from '@/types';

@Injectable()
export class AccessService {
    public readonly resourceType = ResourceType.ACCESS;

    constructor(
        @InjectRepository(Access)
        private repository: Repository<Access>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: WrapperType<UsersService>,
        @Inject(forwardRef(() => UsersCompanyService))
        private readonly usersCompanyService: WrapperType<UsersCompanyService>,
    ) {}

    async create(userId: number, data: CreateAccessDto): Promise<Access> {
        const exists = await this.exists(data);
        if (exists) {
            throw new BadRequestException(`Access record already exists.`);
        }
        await this.availableForUserOrFail(userId, this.resourceType, AccessType.CREATE);
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
        await this.availableForUserOrFail(userId, this.resourceType, AccessType.UPDATE);
        await this.repository.save({ ...data, id, updatedUserId: userId, updatedDate: new Date() });
        return await this.repository.save({ id, ...data });
    }

    async remove(userId: number, id: number) {
        const record = await this.repository.findOne({ where: { id } });
        if (!record) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        await this.availableForUserOrFail(userId, this.resourceType, AccessType.DELETE);
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
        roleType: string,
        resourceType: string,
        accessType: string,
    ): Promise<void> {
        if (!this.available({ roleType, resourceType, accessType })) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
    }

    async availableForUser(params: AvailableAccessUserDto): Promise<boolean> {
        const roleType = await this.usersService.getUserRoleTypeOrFail(params.userId);
        return this.available({
            roleType,
            resourceType: params.resourceType,
            accessType: params.accessType,
        });
    }

    async availableForUserOrFail(
        userId: number,
        resourceType: string,
        accessType: string,
    ): Promise<void> {
        if (!(await this.availableForUser({ userId, resourceType, accessType }))) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
    }

    async availableForUserCompany(params: AvailableAccessUserCompanyDto): Promise<boolean> {
        const roleType = await this.usersCompanyService.getUserCompanyRoleTypeOrFail(
            params.userId,
            params.companyId,
        );
        await this.usersCompanyService.getUserCompanyRoleTypeOrFail(
            params.userId,
            params.companyId,
        );
        return await this.available({
            roleType,
            resourceType: params.resourceType,
            accessType: params.accessType,
        });
    }

    async availableForUserCompanyOrFail(
        userId: number,
        companyId: number,
        resourceType: string,
        accessType: string,
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
        const canRegister = [RoleType.EMPLOYER, RoleType.EMPLOYEE, RoleType.GUEST];
        return canRegister.includes(roleType as RoleType);
    }

    canOperateRoleType(parentUserRoleType: string, childUserRoleType: string) {
        const whoMadeWho = [
            // ADMIN
            { parent: RoleType.ADMIN, child: RoleType.ADMIN },
            { parent: RoleType.ADMIN, child: RoleType.EMPLOYER },
            { parent: RoleType.ADMIN, child: RoleType.OBSERVER },
            { parent: RoleType.ADMIN, child: RoleType.EMPLOYEE },
            { parent: RoleType.ADMIN, child: RoleType.GUEST },
            // EMPLOYER
            { parent: RoleType.EMPLOYER, child: RoleType.EMPLOYEE },
            { parent: RoleType.EMPLOYER, child: RoleType.OBSERVER },
            { parent: RoleType.EMPLOYER, child: RoleType.EMPLOYEE },
            { parent: RoleType.EMPLOYER, child: RoleType.GUEST },
        ];
        return (
            whoMadeWho.findIndex(
                (o) => o.parent === parentUserRoleType && o.child === childUserRoleType,
            ) >= 0
        );
    }
}
