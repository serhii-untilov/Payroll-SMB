import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { Access } from './entities/access.entity';
import { AvailableAccessDto } from './dto/available-access.dto';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Access)
        private accessRepository: Repository<Access>,
        private readonly usersService: UsersService,
    ) {}

    async create(userId: number, data: CreateAccessDto): Promise<Access> {
        if (!this.exists(data.roleType, data.resourceType, data.accessType)) {
            throw new BadRequestException(`Access record already exists.`);
        }
        const user = await this.usersService.findOne({
            where: { id: userId },
            relations: { role: true },
        });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        if (
            !this.available({
                roleType: user.role.type,
                resourceType: ResourceType.ACCESS,
                accessType: AccessType.CREATE,
            })
        ) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
        return await this.accessRepository.save(data);
    }

    async findAll(roleType: string, resourceType: string): Promise<Access[]> {
        const where = {};
        if (roleType) where['roleType'] = roleType;
        if (resourceType) where['resourceType'] = resourceType;
        return await this.accessRepository.find(where);
    }

    async findOne(id: number) {
        return await this.accessRepository.findOne({ where: { id } });
    }

    async update(userId: number, id: number, data: UpdateAccessDto) {
        if (!this.exists(data.roleType, data.resourceType, data.accessType)) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        const user = await this.usersService.findOne({
            where: { id: userId },
            relations: { role: true },
        });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        if (
            !this.available({
                roleType: user.role.type,
                resourceType: ResourceType.ACCESS,
                accessType: AccessType.UPDATE,
            })
        ) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
        await this.accessRepository.save({ ...data, id, updatedUserId: userId });
        const updated = await this.accessRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number) {
        const data = await this.accessRepository.findOne({ where: { id } });
        if (!data) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        const user = await this.usersService.findOne({
            where: { id: userId },
            relations: { role: true },
        });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        if (
            !this.available({
                roleType: user.role.type,
                resourceType: ResourceType.ACCESS,
                accessType: AccessType.DELETE,
            })
        ) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
        const deleted = { ...data, id, deletedDate: new Date(), deletedUserId: userId };
        await this.accessRepository.save(deleted);
        return deleted;
    }

    async exists(roleType: string, resourceType: string, accessType: string) {
        return await this.accessRepository.exists({
            where: { roleType, resourceType, accessType },
        });
    }

    async available(availableAccessDto: AvailableAccessDto) {
        return await this.accessRepository.exists({
            where: availableAccessDto,
        });
    }
}
