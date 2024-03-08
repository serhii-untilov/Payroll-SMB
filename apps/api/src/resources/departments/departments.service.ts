import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser } from '@repo/shared';

@Injectable()
export class DepartmentsService {
    constructor(
        @InjectRepository(Department)
        private DepartmentsRepository: Repository<Department>,
    ) {}

    async create(user: IUser, Department: CreateDepartmentDto): Promise<Department> {
        const existing = await this.DepartmentsRepository.findOneBy({ name: Department.name });
        if (existing) {
            throw new BadRequestException(`Department '${Department.name}' already exists.`);
        }
        const newDepartment = await this.DepartmentsRepository.save({
            ...Department,
            createdUser: user,
            updatedUser: user,
        });
        return newDepartment;
    }

    async findAll(): Promise<Department[]> {
        return await this.DepartmentsRepository.find();
    }

    async findOne(params): Promise<Department> {
        const Department = await this.DepartmentsRepository.findOne(params);
        if (!Department) {
            throw new NotFoundException(`Department could not be found.`);
        }
        return Department;
    }

    async update(user: IUser, id: number, data: UpdateDepartmentDto): Promise<Department> {
        const Department = await this.DepartmentsRepository.findOneBy({ id });
        if (!Department) {
            throw new NotFoundException(`Department could not be found.`);
        }
        await this.DepartmentsRepository.save({
            ...data,
            id,
            updatedUser: user,
        });
        const updated = await this.DepartmentsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(user: IUser, id: number): Promise<Department> {
        const Department = await this.DepartmentsRepository.findOneBy({ id });
        if (!Department) {
            throw new NotFoundException(`Department could not be found.`);
        }
        await this.DepartmentsRepository.save({
            ...Department,
            deletedDate: new Date(),
            deletedUser: user,
        });
        return Department;
    }
}
