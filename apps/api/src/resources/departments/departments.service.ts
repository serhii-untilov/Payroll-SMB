import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
    public readonly resourceType = ResourceType.DEPARTMENT;

    constructor(
        @InjectRepository(Department)
        private repository: Repository<Department>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreateDepartmentDto): Promise<Department> {
        const existing = await this.repository.findOneBy({
            companyId: payload.companyId,
            name: payload.name,
        });
        if (existing) {
            throw new ConflictException(`Department '${payload.name}' already exists.`);
        }
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            payload.companyId,
            this.resourceType,
            AccessType.CREATE,
        );
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(
        userId: number,
        companyId: number,
        relations: boolean = false,
    ): Promise<Department[]> {
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.find({
            relations: {
                company: relations,
                parentDepartment: relations,
                childDepartments: relations,
            },
            where: { companyId },
        });
    }

    async findOne(userId: number, id: number, relations: boolean = false): Promise<Department> {
        const department = await this.repository.findOneOrFail({
            relations: {
                company: relations,
                parentDepartment: relations,
                childDepartments: relations,
            },
            where: { id },
        });
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            department.companyId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return department;
    }

    async update(userId: number, id: number, payload: UpdateDepartmentDto): Promise<Department> {
        const department = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            department.companyId,
            this.resourceType,
            AccessType.UPDATE,
        );
        return await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
        });
    }

    async remove(userId: number, id: number): Promise<Department> {
        const department = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserCompanyOrFail(
            userId,
            department.companyId,
            this.resourceType,
            AccessType.DELETE,
        );
        return await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }
}
