import { Action, Resource, RoleType } from '@/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base/user-access.abstract';
import { UserAccessService } from '../user-access/user-access.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService extends BaseUserAccess {
    constructor(
        @InjectRepository(Role) private readonly repository: Repository<Role>,
        readonly userAccess: UserAccessService,
    ) {
        super(userAccess, Resource.Role);
    }

    async create(userId: string, dto: CreateRoleDto): Promise<Role> {
        await this.canOrFail(userId, Action.Create);
        return await this.repository.save({
            ...dto,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async update(userId: string, id: string, version: number, data: UpdateRoleDto): Promise<void> {
        await this.canOrFail(userId, Action.Update, id);
        await this.repository.update({ id, version }, { ...data, updatedUserId: userId, updatedDate: new Date() });
    }

    async remove(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Remove, id);
        await this.repository.update({ id, version }, { deletedUserId: userId, deletedDate: new Date() });
    }

    async restore(userId: string, id: string, version: number): Promise<void> {
        await this.canOrFail(userId, Action.Restore, id);
        await this.repository.update({ id, version }, { deletedUserId: null, deletedDate: null });
    }

    async findAll(userId: string, params?: FindManyOptions): Promise<Role[]> {
        await this.canOrFail(userId, Action.Read);
        return await this.repository.find(params);
    }

    async findOne(userId: string, id: string): Promise<Role> {
        await this.canOrFail(userId, Action.Read, id);
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async getRoleType(id: string): Promise<string> {
        const role = await this.repository.findOneOrFail({ select: { type: true }, where: { id } });
        return role.type;
    }

    async findRoleByType(type: RoleType): Promise<Role> {
        return await this.repository.findOneOrFail({ where: { type } });
    }
}
