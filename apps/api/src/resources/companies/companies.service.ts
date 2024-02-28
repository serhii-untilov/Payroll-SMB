import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private companiesRepository: Repository<Company>,
    ) {}

    async create(company: CreateCompanyDto): Promise<Company> {
        const existing = this.companiesRepository.findOne({ where: { name: company.name } });
        if (existing) {
            throw new BadRequestException(`Company '${company.name}' already exists.`);
        }
        const { name } = company;
        const newCompany = await this.companiesRepository.save({ name });
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

    async update(id: number, data: UpdateCompanyDto): Promise<Company> {
        const company = await this.companiesRepository.findOneBy({ id });
        if (!company) {
            throw new NotFoundException(`Company could not be found.`);
        }
        await this.companiesRepository.save({ id, ...data });
        const updated = await this.companiesRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(id: number): Promise<Company> {
        const company = await this.companiesRepository.findOneBy({ id });
        if (!company) {
            throw new NotFoundException(`Company could not be found.`);
        }
        await this.companiesRepository.remove(company);
        return company;
    }
}
