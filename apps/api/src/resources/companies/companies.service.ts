import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '@repo/shared';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private companiesRepository: Repository<Company>,
    ) {}

    async create(user: IUser, company: CreateCompanyDto): Promise<Company> {
        const existing = await this.companiesRepository.findOneBy({ name: company.name });
        if (existing) {
            throw new BadRequestException(`Company '${company.name}' already exists.`);
        }
        const newCompany = await this.companiesRepository.save({
            ...company,
            owner: user,
            createdUser: user,
            updatedUser: user,
        });
        return newCompany;
    }

    async findAll(): Promise<Company[]> {
        return await this.companiesRepository.find();
    }

    async findOne(id: number): Promise<Company> {
        const company = await this.companiesRepository.findOneBy({ id });
        if (!company) {
            throw new NotFoundException(`Company could not be found.`);
        }
        return company;
    }

    async update(user: IUser, id: number, data: UpdateCompanyDto): Promise<Company> {
        const company = await this.companiesRepository.findOneBy({ id });
        if (!company) {
            throw new NotFoundException(`Company could not be found.`);
        }
        await this.companiesRepository.save({
            ...data,
            id,
            updatedUser: user,
        });
        const updated = await this.companiesRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(user: IUser, id: number): Promise<Company> {
        const company = await this.companiesRepository.findOneBy({ id });
        if (!company) {
            throw new NotFoundException(`Company could not be found.`);
        }
        await this.companiesRepository.save({
            ...company,
            deletedDate: new Date(),
            deletedUser: user,
        });
        return company;
    }
}
