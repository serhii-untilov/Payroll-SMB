import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private rolesRepository: Repository<Role>,
    ) {}

    async create(role: CreateRoleDto): Promise<Role> {
        const existing = this.rolesRepository.findOne({ where: { name: role.name } });
        if (existing) {
            throw new BadRequestException(`Role '${role.name}' already exists.`);
        }
        const { name } = role;
        const newRole = await this.rolesRepository.save({ name });
        return newRole;
    }

    async findAll(): Promise<Role[]> {
        return await this.rolesRepository.find();
    }

    async findOne(id: number): Promise<Role> {
        const role = await this.rolesRepository.findOneBy({ id });
        if (!role) {
            throw new NotFoundException(`Role could not be found.`);
        }
        return role;
    }

    async update(id: number, data: UpdateRoleDto): Promise<Role> {
        const role = await this.rolesRepository.findOneBy({ id });
        if (!role) {
            throw new NotFoundException(`Role could not be found.`);
        }
        await this.rolesRepository.save({ id, ...data });
        const updated = await this.rolesRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(id: number): Promise<Role> {
        const role = await this.rolesRepository.findOneBy({ id });
        if (!role) {
            throw new NotFoundException(`Role could not be found.`);
        }
        await this.rolesRepository.remove(role);
        return role;
    }
}
