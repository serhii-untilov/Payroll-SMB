import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { Accounting } from './entities/accounting.entity';

@Injectable()
export class AccountingService {
    public readonly resourceType = ResourceType.ACCOUNTING;

    constructor(
        @InjectRepository(Accounting)
        private repository: Repository<Accounting>,
    ) {}

    async findAll(): Promise<Accounting[]> {
        return await this.repository.find();
    }

    async findOne(id: number): Promise<Accounting> {
        const accounting = await this.repository.findOneBy({ id });
        if (!accounting) {
            throw new NotFoundException(`Accounting could not be found.`);
        }
        return accounting;
    }
}
