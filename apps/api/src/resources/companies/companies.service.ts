import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { UsersCompanyService } from '../users/users-company.service';
import { UsersService } from '../users/users.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
    public readonly resourceType = ResourceType.COMPANY;

    constructor(
        @InjectRepository(Company)
        private repository: Repository<Company>,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService,
        @Inject(forwardRef(() => UsersCompanyService))
        private usersCompanyService: UsersCompanyService,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreateCompanyDto): Promise<Company> {
        const existing = await this.repository.findOneBy({ name: payload.name });
        if (existing) {
            throw new BadRequestException(`Company '${payload.name}' already exists.`);
        }
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.CREATE,
        );
        const newCompany = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        const user = await this.usersService.findOneOrFail({ where: { id: userId } });
        if (!user || !user.roleId) {
            throw new NotFoundException('User or Role not found.');
        }
        await this.usersCompanyService.create(userId, {
            userId,
            companyId: newCompany.id,
            roleId: user.roleId,
        });
        return newCompany;
    }

    async findAll(userId: number, relations: boolean): Promise<Company[]> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.find({
            relations: {
                law: relations,
                accounting: relations,
                users: true,
            },
            where: {
                users: { userId },
            },
        });
    }

    async findOne(userId: number, id: number, relations: boolean = false): Promise<Company | null> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const company = await this.repository.findOneOrFail({
            relations: {
                law: !!relations,
                accounting: !!relations,
                users: true,
            },
            where: {
                id,
                users: { userId },
            },
        });
        return company;
    }

    async findOneOrFail(userId: number, id: number, relations: boolean = false): Promise<Company> {
        const company = await this.findOne(userId, id, relations);
        if (!company) {
            throw new NotFoundException(`Company could not be found or user doesn't have access.`);
        }
        return company;
    }

    async update(userId: number, id: number, payload: UpdateCompanyDto): Promise<Company> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        await this.usersCompanyService.getUserCompanyRoleTypeOrException(userId, id);
        return await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
        });
    }

    async remove(userId: number, id: number): Promise<Company> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        await this.usersCompanyService.getUserCompanyRoleTypeOrException(userId, id);
        return await this.repository.save({
            id,
            deletedDate: new Date(),
            deletedUserId: userId,
        });
    }
}
