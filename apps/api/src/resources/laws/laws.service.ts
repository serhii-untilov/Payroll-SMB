import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Law } from './entities/law.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LawsService {
    constructor(
        @InjectRepository(Law)
        private lawsRepository: Repository<Law>,
    ) {}

    async create(law: CreateLawDto): Promise<Law> {
        const existing = this.lawsRepository.findOne({ where: { name: law.name } });
        if (existing) {
            throw new BadRequestException(`Law '${law.name}' already exists.`);
        }
        const { name } = law;
        const newLaw = await this.lawsRepository.save({ name });
        return newLaw;
    }

    async findAll(): Promise<Law[]> {
        return await this.lawsRepository.find();
    }

    async findOne(id: number): Promise<Law> {
        const law = await this.lawsRepository.findOneBy({ id });
        if (!law) {
            throw new NotFoundException(`Law could not be found.`);
        }
        return law;
    }

    async update(id: number, data: UpdateLawDto): Promise<Law> {
        const law = await this.lawsRepository.findOneBy({ id });
        if (!law) {
            throw new NotFoundException(`Law could not be found.`);
        }
        await this.lawsRepository.save({ id, ...data });
        const updated = await this.lawsRepository.findOneBy({ id });
        return updated;
    }

    async remove(id: number): Promise<null> {
        const law = await this.lawsRepository.findOneBy({ id });
        if (!law) {
            throw new NotFoundException(`Law could not be found.`);
        }
        await this.lawsRepository.remove(law);
        return null;
    }
}
