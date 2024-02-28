import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountingDto } from './dto/create-accounting.dto';
import { UpdateAccountingDto } from './dto/update-accounting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounting } from './entities/accounting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountingService {
    constructor(
        @InjectRepository(Accounting)
        private accountingRepository: Repository<Accounting>,
    ) {}

    async create(accounting: CreateAccountingDto): Promise<Accounting> {
        const existing = this.accountingRepository.findOne({ where: { name: accounting.name } });
        if (existing) {
            throw new BadRequestException(`Accounting '${accounting.name}' already exists.`);
        }
        const { name } = accounting;
        const newAccounting = await this.accountingRepository.save({ name });
        return newAccounting;
    }

    async findAll(): Promise<Accounting[]> {
        return await this.accountingRepository.find();
    }

    async findOne(id: number): Promise<Accounting> {
        const accounting = await this.accountingRepository.findOneBy({ id });
        if (!accounting) {
            throw new NotFoundException(`Accounting could not be found.`);
        }
        return accounting;
    }

    async update(id: number, data: UpdateAccountingDto): Promise<Accounting> {
        const accounting = await this.accountingRepository.findOneBy({ id });
        if (!accounting) {
            throw new NotFoundException(`Accounting could not be found.`);
        }
        await this.accountingRepository.save({ id, ...data });
        const updated = await this.accountingRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(id: number): Promise<Accounting> {
        const accounting = await this.accountingRepository.findOneBy({ id });
        if (!accounting) {
            throw new NotFoundException(`Accounting could not be found.`);
        }
        await this.accountingRepository.remove(accounting);
        return accounting;
    }
}
