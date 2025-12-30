import { BadRequestException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Action, Resource, RoleType } from '@/types';
import { FindManyOptions, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { WrapperType } from '@/types';

@Injectable()
export class RolesService {
    public readonly resource = Resource.Role;

    constructor(
        @InjectRepository(Role)
        private repository: Repository<Role>,
        @Inject(forwardRef(() => AccessService))
        private accessService: WrapperType<AccessService>,
    ) {}

    async create(userId: string, payload: CreateRoleDto): Promise<Role> {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Create);
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

    async findAll(userId: string, params?: FindManyOptions): Promise<Role[]> {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Read);
        return await this.repository.find(params);
    }

    async findOne(userId: string, id: string): Promise<Role> {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Read);
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: string, id: string, data: UpdateRoleDto): Promise<Role> {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Update);
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({
            ...data,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
    }

    async remove(userId: string, id: string): Promise<Role> {
        await this.accessService.availableForUserOrFail(userId, this.resource, Action.Delete);
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
    }

    async getRoleType(id: string): Promise<string> {
        const role = await this.repository.findOneOrFail({ select: { type: true }, where: { id } });
        return role.type;
    }

    async findRoleByType(type: RoleType): Promise<string> {
        const role = await this.repository.findOneOrFail({ where: { type } });
        return role.id;
    }
}
