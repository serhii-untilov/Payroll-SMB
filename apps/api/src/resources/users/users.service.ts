import {
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AccessType,
    IPublicUserData,
    IUser,
    ResourceType,
    RoleType,
    canCreateUser,
} from '@repo/shared';
import * as _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    public readonly resourceType = ResourceType.USER;

    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
        @Inject(forwardRef(() => RolesService))
        private rolesService: RolesService,
    ) {}

    async create(userId: number | null, payload: CreateUserDto): Promise<User> {
        const exists = await this.repository.findOneBy({ email: payload.email });
        if (exists) {
            throw new ConflictException('User already exists.');
        }
        if (userId) {
            await this.accessService.availableForUserOrFail(
                userId,
                this.resourceType,
                AccessType.CREATE,
            );
        }
        const parentRoleType = await this.getUserRoleTypeOrException(userId);
        const childRoleType = await this.rolesService.getRoleType(payload.roleId);
        if (!canCreateUser(parentRoleType, childRoleType)) {
            throw new ForbiddenException(`User doesn't have access to the requested operation.`);
        }
        return await this.repository.save({
            ...payload,
            ...(userId ? { createdUserId: userId } : {}),
            ...(userId ? { updatedUserId: userId } : {}),
        });
    }

    async findAll(userId: number, params: FindManyOptions<User>): Promise<User[]> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.find(params);
    }

    async findOne(params: FindOneOptions<User>): Promise<User> {
        return await this.repository.findOne(params);
    }

    async findOneOrFail(params: FindOneOptions<User>): Promise<User> {
        const user = await this.findOne(params);
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return user;
    }

    async update(userId: number, id: number, payload: UpdateUserDto): Promise<User> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        const user = await this.repository.findOneOrFail({ where: { id } });
        const parentRoleType = await this.getUserRoleTypeOrException(userId);
        let childRoleType = await this.rolesService.getRoleType(user.roleId);
        if (!canCreateUser(parentRoleType, childRoleType)) {
            throw new ForbiddenException(`User doesn't have access to the requested operation.`);
        }
        if (payload?.roleId) {
            childRoleType = await this.rolesService.getRoleType(payload.roleId);
            if (!canCreateUser(parentRoleType, childRoleType)) {
                throw new ForbiddenException(
                    `User doesn't have access to the requested operation.`,
                );
            }
        }
        return await this.repository.save({ id, ...payload, updatedUserId: userId });
    }

    async remove(userId: number, id: number): Promise<User> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        const user = await this.repository.findOneOrFail({ where: { id } });
        const parentRoleType = await this.getUserRoleTypeOrException(userId);
        const childRoleType = await this.rolesService.getRoleType(user.roleId);
        if (!canCreateUser(parentRoleType, childRoleType)) {
            throw new ForbiddenException(`User doesn't have access to the requested operation.`);
        }
        return await this.repository.save({
            ...user,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }

    public static toPublic(user: IUser): IPublicUserData {
        const publicUser = _.omit(user, ['password', 'refreshToken']);
        return publicUser;
    }

    async getUserRoleType(id: number): Promise<string> {
        const user = await this.repository.findOne({
            where: { id },
            relations: { role: true },
        });
        return user?.role?.type;
    }

    async getUserRoleTypeOrException(id: number): Promise<string> {
        const roleType = await this.getUserRoleType(id);
        if (!roleType) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
        return roleType;
    }

    async getSystemUserId(): Promise<number> {
        const user = await this.repository.findOne({
            select: { id: true },
            relations: { role: true },
            where: { role: { type: RoleType.SYSTEM } },
        });
        return user.id;
    }
}
