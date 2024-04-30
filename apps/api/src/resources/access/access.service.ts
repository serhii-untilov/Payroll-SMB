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
import { AvailableAccessDto } from './dto/available-access.dto';
import { CreateAccessDto } from './dto/create-access.dto';
import { UpdateAccessDto } from './dto/update-access.dto';
import { Access } from './entities/access.entity';

@Injectable()
export class AccessService {
    constructor(
        @InjectRepository(Access)
        private accessRepository: Repository<Access>,
        private readonly usersService: UsersService,
    ) {}

    async create(userId: number, data: CreateAccessDto): Promise<Access> {
        if (this.exists(data)) {
            throw new BadRequestException(`Access record already exists.`);
        }
        const roleType = await this.usersService.getUserRoleTypeOrException(userId);
        this.availableOrException(roleType, ResourceType.ACCESS, AccessType.CREATE);
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

    async update(userId: number, id: number, data: UpdateAccessDto): Promise<Access> {
        const record = this.accessRepository.findOneBy({ id });
        if (!record) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        const roleType = await this.usersService.getUserRoleTypeOrException(userId);
        this.availableOrException(roleType, ResourceType.ACCESS, AccessType.UPDATE);
        await this.accessRepository.save({ ...data, id, updatedUserId: userId });
        return await this.accessRepository.save({ id, ...data });
    }

    async remove(userId: number, id: number) {
        const record = await this.accessRepository.findOne({ where: { id } });
        if (!record) {
            throw new NotFoundException(`Access record could not be found.`);
        }
        const roleType = await this.usersService.getUserRoleTypeOrException(userId);
        this.availableOrException(roleType, ResourceType.ACCESS, AccessType.DELETE);
        const deleted = { ...record, id, deletedDate: new Date(), deletedUserId: userId };
        await this.accessRepository.save(deleted);
        return deleted;
    }

    async exists(params: AvailableAccessDto) {
        return await this.accessRepository.exists({
            where: params,
        });
    }

    async available(params: AvailableAccessDto): Promise<boolean> {
        return await this.accessRepository.exists({
            where: params,
        });
    }

    async availableOrException(
        roleType: string,
        resourceType: string,
        accessType: string,
    ): Promise<void> {
        if (!this.available({ roleType, resourceType, accessType })) {
            throw new ForbiddenException(`User doesn't have access to the requested resource.`);
        }
    }
}
