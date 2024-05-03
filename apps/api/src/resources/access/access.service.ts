import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import {
    AvailableAccessDto,
    AvailableAccessUserDto,
    AvailableAccessUserCompanyDto,
} from './dto/available-access.dto';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { Access } from './entities/access.entity';
import { UsersCompanyService } from '../users/users-company.service';

@Injectable()
export class AccessService {
    public readonly resourceType = ResourceType.ACCESS;

    constructor(
        @InjectRepository(Access)
        private repository: Repository<Access>,
        @Inject(forwardRef(() => UsersService))
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => UsersCompanyService))
        private readonly usersCompanyService: UsersCompanyService,
    ) {}

    async create(userId: number, data: CreateAccessDto): Promise<Access> {
        if (this.exists(data)) {
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
        return await this.repository.findOne({ where: { id } });
    }

    async update(userId: number, id: number, data: UpdateAccessDto): Promise<Access> {
        const record = this.repository.findOneBy({ id });
        if (!record) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        await this.availableForUserOrFail(userId, this.resourceType, AccessType.UPDATE);
        await this.repository.save({ ...data, id, updatedUserId: userId });
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

    async exists(params: AvailableAccessDto) {
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
        const roleType = await this.usersService.getUserRoleTypeOrException(params.userId);
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
        const roleType = await this.usersCompanyService.getUserCompanyRoleTypeOrException(
            params.userId,
            params.companyId,
        );
        await this.usersCompanyService.getUserCompanyRoleTypeOrException(
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
}
