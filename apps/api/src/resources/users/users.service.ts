import { AccessType, ResourceType, RoleType, WrapperType } from '@/types';
import {
    BadRequestException,
    ForbiddenException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto, PublicUserDataDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    public readonly resourceType = ResourceType.User;

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
            throw new HttpException('User already exists.', HttpStatus.CONFLICT);
        }
        if (!payload.roleId) {
            payload.roleId = await this.rolesService.findRoleByType(RoleType.Employer);
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
            throw new HttpException('User already exists.', HttpStatus.CONFLICT);
        }
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Create,
        );
        const currentRoleType = await this.getUserRoleType(userId);
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
            AccessType.Access,
        );
        return await this.repository.find(params);
    }

    async findOne(params: FindOneOptions<User>): Promise<User | null> {
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
        if (userId !== id) {
            await this.accessService.availableForUserOrFail(
                userId,
                this.resourceType,
                AccessType.Update,
            );
        }
        if (payload?.roleId) {
            const userRoleType = await this.getUserRoleType(userId);
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
            AccessType.Delete,
        );
        const user = await this.repository.findOneOrFail({ where: { id } });
        const userRoleType = await this.getUserRoleType(userId);
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

    public toPublic(user: User): PublicUserDataDto {
        const publicUser = _.omit(user, ['password', 'refreshToken']);
        return publicUser;
    }

    async getUserRoleType(id: number): Promise<RoleType> {
        const user = await this.repository.findOneOrFail({
            where: { id },
            relations: { role: true },
        });
        if (!user?.role?.type) {
            throw new NotFoundException('User role type not found.');
        }
        return user.role.type;
    }

    async getSystemUserId(): Promise<number> {
        const user = await this.repository.findOneOrFail({
            select: { id: true },
            relations: { role: true },
            where: { role: { type: RoleType.System } },
        });
        return user.id;
    }
}
