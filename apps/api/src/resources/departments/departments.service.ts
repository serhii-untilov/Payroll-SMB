import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Department)
        private DepartmentsRepository: Repository<Department>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Company)
        private companyRepository: Repository<Company>,
    ) {}

    async create(userId: number, Department: CreateDepartmentDto): Promise<Department> {
        const existing = await this.DepartmentsRepository.findOneBy({ name: Department.name });
        if (existing) {
            throw new BadRequestException(`Department '${Department.name}' already exists.`);
        }
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        const company = await this.companyRepository.findOneBy({ id: Department.companyId });
        if (!company) {
            throw new BadRequestException(`Company '${Department.companyId}' not found.`);
        }
        const newDepartment = await this.DepartmentsRepository.save({
            ...Department,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return newDepartment;
    }

    async findAll(params): Promise<Department[]> {
        return await this.DepartmentsRepository.find(params);
    }

    async findOne(params): Promise<Department> {
        const Department = await this.DepartmentsRepository.findOne(params);
        if (!Department) {
            throw new NotFoundException(`Department could not be found.`);
        }
        return Department;
    }

    async update(userId: number, id: number, data: UpdateDepartmentDto): Promise<Department> {
        const Department = await this.DepartmentsRepository.findOneBy({ id });
        if (!Department) {
            throw new NotFoundException(`Department could not be found.`);
        }
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        const company = await this.companyRepository.findOneBy({ id: Department.companyId });
        if (!company) {
            throw new BadRequestException(`Company '${Department.companyId}' not found.`);
        }
        await this.DepartmentsRepository.save({
            ...data,
            id,
            updatedUserId: userId,
        });
        const updated = await this.DepartmentsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<Department> {
        const Department = await this.DepartmentsRepository.findOneBy({ id });
        if (!Department) {
            throw new NotFoundException(`Department could not be found.`);
        }
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new BadRequestException(`User '${userId}' not found.`);
        }
        await this.DepartmentsRepository.save({
            ...Department,
            deletedDate: new Date(),
            deletedUserId: userId,
        });
        return Department;
    }
}
