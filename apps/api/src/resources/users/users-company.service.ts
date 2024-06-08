import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateUserCompanyDto } from './dto/create-user-company.dto';
import { UpdateUserCompanyDto } from './dto/update-user-company.dto';
import { UserCompany } from './entities/user-company.entity';

@Injectable()
export class UsersCompanyService {
    public readonly resourceType = ResourceType.COMPANY;

    constructor(
        @InjectRepository(UserCompany)
        private repository: Repository<UserCompany>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreateUserCompanyDto): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.CREATE,
        );
        return await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
    }

    async findAll(userId: number, relations: boolean): Promise<UserCompany[]> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.find({
            ...(relations ? { relations: { company: true, role: true } } : {}),
        });
    }

    async findOne(userId: number, id: number): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        const userCompany = this.repository.findOneBy({ id });
        if (!userCompany) {
            throw new NotFoundException(`User's company could not be found.`);
        }
        return userCompany;
    }

    async findOneByName(userId: number, name: string): Promise<UserCompany> {
        return await this.repository.findOne({
            relations: { company: true },
            where: { userId, company: { name } },
        });
    }

    async update(userId: number, id: number, payload: UpdateUserCompanyDto): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        await this.repository.save({ id, ...payload, updatedUserId: userId });
        // re-query the database so that the updated record is returned
        return await this.repository.findOneOrFail({ where: { id } });
    }

    async remove(userId: number, id: number): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        // const record = await this.repository.findOne({
        //     relations: {
        //         company: true,
        //     },
        //     where: { id },
        // });
        // if (record.company.createdUserId === userId) {
        //     throw new BadRequestException(`The user can't delete access to his own company.`);
        // }
        await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
        return await this.repository.findOne({ where: { id }, withDeleted: true });
    }

    async restore(userId: number, id: number): Promise<UserCompany> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        await this.repository.save({
            id,
            deletedUserId: null,
            deletedDate: null,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOne({ where: { id } });
    }

    async getUserCompanyList(
        userId: number,
        id: number,
        relations: boolean,
        deleted: boolean,
    ): Promise<UserCompany[]> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.ACCESS,
        );
        return await this.repository.find({
            where: { userId: id },
            withDeleted: deleted,
            ...(relations ? { relations: { company: true, role: true } } : {}),
        });
    }

    async getUserCompanyRoleType(userId: number, companyId: number): Promise<string> {
        const record = await this.repository.findOne({
            where: { userId, companyId },
            relations: { role: true },
        });
        return record?.role?.type;
    }

    async getUserCompanyRoleTypeOrFail(userId: number, companyId: number): Promise<string> {
        const roleType = await this.getUserCompanyRoleType(userId, companyId);
        if (!roleType) {
            throw new ForbiddenException(
                `User doesn't have access to the requested Company's resource.`,
            );
        }
        return roleType;
    }

    async count(userId: number, companyId: number): Promise<number> {
        const { count } = await this.repository
            .createQueryBuilder('user_company')
            .select('COUNT(*)', 'count')
            .where('"userId" = :userId', { userId })
            .andWhere('"companyId" = :companyId', { companyId })
            .andWhere('"deletedDate" is null')
            .getRawOne();
        return Number(count);
    }
}
