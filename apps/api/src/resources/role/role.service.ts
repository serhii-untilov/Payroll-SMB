import { Action, Resource, RoleType } from '@/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
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
        if (!(await this.canUser(userId, Action.Create))) {
            throw new ForbiddenException();
        }
        return await this.repository.save({
            ...dto,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(userId: string, params?: FindManyOptions): Promise<Role[]> {
        if (!(await this.canUser(userId, Action.Read))) {
            throw new ForbiddenException();
        }
        return await this.repository.find(params);
    }

    async findOne(userId: string, id: string): Promise<Role> {
        if (!(await this.canUser(userId, Action.Read, id))) {
            throw new ForbiddenException();
        }
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async update(userId: string, id: string, data: UpdateRoleDto): Promise<void> {
        if (!(await this.canUser(userId, Action.Update, id))) {
            throw new ForbiddenException();
        }
        await this.repository.update({ id }, { ...data, updatedUserId: userId, updatedDate: new Date() });
    }

    async remove(userId: string, id: string): Promise<void> {
        if (!(await this.canUser(userId, Action.Remove, id))) {
            throw new ForbiddenException();
        }
        await this.repository.update({ id }, { deletedUserId: userId, deletedDate: new Date() });
    }

    async getRoleType(id: string): Promise<string> {
        const role = await this.repository.findOneOrFail({ select: { type: true }, where: { id } });
        return role.type;
    }

    async findRoleByType(type: RoleType): Promise<Role> {
        return await this.repository.findOneOrFail({ where: { type } });
    }
}
