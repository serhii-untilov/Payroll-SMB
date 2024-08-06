import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType, RoleType } from '@/types';
import { FindManyOptions, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { WrapperType } from '@/types';

@Injectable()
export class RolesService {
    public readonly resourceType = ResourceType.Role;

    constructor(
        @InjectRepository(Role)
        private repository: Repository<Role>,
        @Inject(forwardRef(() => AccessService))
        private accessService: WrapperType<AccessService>,
    ) {}

    async create(userId: number, payload: CreateRoleDto): Promise<Role> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Create,
        );
        const existing = await this.repository.findOne({ where: { name: payload.name } });
        if (existing) {
            throw new BadRequestException(`Role '${existing.name}' already exists.`);
        }
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(userId: number, params?: FindManyOptions): Promise<Role[]> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Access,
        );
        return await this.repository.find(params);
    }

    async findOne(userId: number, id: number): Promise<Role> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Access,
        );
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: number, id: number, data: UpdateRoleDto): Promise<Role> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Update,
        );
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({
            ...data,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
    }

    async remove(userId: number, id: number): Promise<Role> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Delete,
        );
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
    }

    async getRoleType(id: number): Promise<string> {
        const role = await this.repository.findOneOrFail({ select: { type: true }, where: { id } });
        return role.type;
    }

    async findRoleByType(type: RoleType): Promise<number> {
        const role = await this.repository.findOneOrFail({ where: { type } });
        return role.id;
    }
}
