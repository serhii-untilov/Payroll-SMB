import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { Resource, RoleType, WrapperType } from '@/types';
import {
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
import { FindOneOptions, Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { RolesService } from '../roles/roles.service';
import { UserRole } from '../user-role/entities/user-role.entity';
import { CreateUserDto, PublicUserDataDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    public readonly resource = Resource.User;

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(UserRole) private userCompanyRepository: Repository<UserRole>,
        @Inject(forwardRef(() => AccessService)) private accessService: WrapperType<AccessService>,
        @Inject(forwardRef(() => RolesService)) private rolesService: WrapperType<RolesService>,
    ) {}

    async register(payload: CreateUserDto): Promise<User> {
        const exists = await this.userRepository.findOneBy({ email: payload.email });
        if (exists) {
            throw new HttpException('User already exists.', HttpStatus.CONFLICT);
        }
        return await this.userRepository.save(payload);
    }

    async create(userId: string, payload: CreateUserDto): Promise<User> {
        const exists = await this.userRepository.findOneBy({ email: payload.email });
        if (exists) {
            throw new HttpException('User already exists.', HttpStatus.CONFLICT);
        }
        const currentRoleType = await this.getUserRoleType(userId);
        const newRoleType = await this.rolesService.getRoleType(payload.roleId);
        if (!this.accessService.canOperateRoleType(currentRoleType, newRoleType)) {
            throw new ForbiddenException(`User doesn't have access to the requested operation.`);
        }
        const id = IdGenerator.nextId();
        return await this.userRepository.save({
            id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            password: payload.password,
            ...(userId ? { createdUserId: userId } : {}),
            ...(userId ? { updatedUserId: userId } : {}),
        });
    }

    async findAll(_userId: string): Promise<User[]> {
        return await this.userRepository.find();
    }

    async findOne(params: FindOneOptions<User>): Promise<User | null> {
        return await this.userRepository.findOne(params);
    }

    async findOneOrFail(params: FindOneOptions<User>): Promise<User> {
        const user = await this.findOne(params);
        if (!user) {
            throw new NotFoundException('User not found.');
        }
        return user;
    }

    async update(userId: string, id: string, payload: UpdateUserDto): Promise<User> {
        return await this.userRepository.save({
            id,
            ...payload,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
    }

    async remove(userId: string, id: string): Promise<User> {
        const user = await this.userRepository.findOneOrFail({ where: { id } });
        return await this.userRepository.save({
            ...user,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }

    public toPublic(user: User): PublicUserDataDto {
        const publicUser = _.omit(user, ['password', 'refreshToken']);
        return publicUser;
    }

    async getUserRoleType(_id: string): Promise<RoleType> {
        throw new NotFoundException('User role type not found.');
    }

    async getSystemUserId(): Promise<string> {
        const user = await this.userCompanyRepository.findOneOrFail({
            select: { id: true },

            where: { role: { type: RoleType.System } },
        });
        return user.id;
    }
}
