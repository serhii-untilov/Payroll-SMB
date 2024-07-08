import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, IPublicUserData, IUser, ResourceType, RoleType } from '@repo/shared';
import * as _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { WrapperType } from 'src/types/WrapperType';

@Injectable()
export class UsersService {
    public readonly resourceType = ResourceType.USER;

    constructor(
        @InjectRepository(User)
        private repository: Repository<User>,
        @Inject(forwardRef(() => AccessService))
        private accessService: WrapperType<AccessService>,
        @Inject(forwardRef(() => RolesService))
        private rolesService: WrapperType<RolesService>,
    ) {}

    async register(payload: CreateUserDto): Promise<User> {
        const exists = await this.repository.findOneBy({ email: payload.email });
        if (exists) {
            throw new ConflictException('User already exists.');
        }
        if (!payload.roleId) {
            payload.roleId = await this.rolesService.findRoleByType(RoleType.EMPLOYER);
        }
        if (!payload.roleId) {
            throw new BadRequestException(`Role should be defined.`);
        }
        const roleType = await this.rolesService.getRoleType(payload.roleId);
        if (!this.accessService.canRegisterUserByRoleType(roleType)) {
            throw new BadRequestException(`An invalid role for user registration.`);
        }
        return await this.repository.save(payload);
    }

    async create(userId: number, payload: CreateUserDto): Promise<User> {
        const exists = await this.repository.findOneBy({ email: payload.email });
        if (exists) {
            throw new ConflictException('User already exists.');
        }
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.CREATE,
        );
        const currentRoleType = await this.getUserRoleTypeOrFail(userId);
        const newRoleType = await this.rolesService.getRoleType(payload.roleId);
        if (!this.accessService.canOperateRoleType(currentRoleType, newRoleType)) {
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
        return await this.repository.findOneOrFail(params);
    }

    async findOneOrFail(params: FindOneOptions<User>): Promise<User> {
        const user = await this.findOne(params);
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return user;
    }

    async update(userId: number, id: number, payload: UpdateUserDto): Promise<User> {
        if (userId !== id) {
            await this.accessService.availableForUserOrFail(
                userId,
                this.resourceType,
                AccessType.UPDATE,
            );
        }
        if (payload?.roleId) {
            const userRoleType = await this.getUserRoleTypeOrFail(userId);
            const updateRoleType = await this.rolesService.getRoleType(payload.roleId);
            if (userId !== id || userRoleType != updateRoleType) {
                if (!this.accessService.canOperateRoleType(userRoleType, updateRoleType)) {
                    throw new ForbiddenException(
                        `User doesn't have access to the requested operation.`,
                    );
                }
            }
        }
        return await this.repository.save({
            id,
            ...payload,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
    }

    async remove(userId: number, id: number): Promise<User> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        const user = await this.repository.findOneOrFail({ where: { id } });
        const userRoleType = await this.getUserRoleTypeOrFail(userId);
        const deleteRoleType = await this.rolesService.getRoleType(user.roleId);
        if (userId !== id && !this.accessService.canOperateRoleType(userRoleType, deleteRoleType)) {
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
        const user = await this.repository.findOneOrFail({
            where: { id },
            relations: { role: true },
        });
        if (!user?.role?.type) {
            throw new NotFoundException('User role type not found.');
        }
        return user.role.type;
    }

    async getUserRoleTypeOrFail(id: number): Promise<string> {
        const roleType = await this.getUserRoleType(id);
        if (!roleType) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
        return roleType;
    }

    async getSystemUserId(): Promise<number> {
        const user = await this.repository.findOneOrFail({
            select: { id: true },
            relations: { role: true },
            where: { role: { type: RoleType.SYSTEM } },
        });
        return user.id;
    }
}
