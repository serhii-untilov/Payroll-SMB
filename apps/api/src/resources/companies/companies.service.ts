import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    async create(userId: number, company: CreateCompanyDto): Promise<Company> {
        const existing = await this.companiesRepository.findOneBy({ name: company.name });
        if (existing) {
            throw new BadRequestException(`Company '${company.name}' already exists.`);
        }
        const newCompany = await this.companiesRepository.save({
            ...company,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return newCompany;
    }

    async findAll(): Promise<Company[]> {
        return await this.companiesRepository.find();
    }

    async findOne(params): Promise<Company> {
        const company = await this.companiesRepository.findOne(params);
        if (!company) {
            throw new NotFoundException(`Company could not be found.`);
        }
        return company;
    }

    async update(userId: number, id: number, data: UpdateCompanyDto): Promise<Company> {
        const company = await this.companiesRepository.findOneBy({ id });
        if (!company) {
            throw new NotFoundException(`Company could not be found.`);
        }
        await this.companiesRepository.save({
            ...data,
            id,
            updatedUserId: userId,
        });
        const updated = await this.companiesRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<Company> {
        const company = await this.companiesRepository.findOneBy({ id });
        if (!company) {
            throw new NotFoundException(`Company could not be found.`);
        }
        await this.companiesRepository.save({
            ...company,
            deletedDate: new Date(),
            deletedUserId: userId,
        });
        return company;
    }
}
