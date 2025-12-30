import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from '@/types';
import { Repository } from 'typeorm';
import { Law } from './entities/law.entity';

@Injectable()
export class LawsService {
    public readonly resource = Resource.Law;
    constructor(
        @InjectRepository(Law)
        private repository: Repository<Law>,
    ) {}

    async findAll(): Promise<Law[]> {
        return await this.repository.find();
    }

    async findOne(id: string): Promise<Law> {
        const law = await this.repository.findOneBy({ id });
        if (!law) {
            throw new NotFoundException(`Law could not be found.`);
        }
        return law;
    }
}
