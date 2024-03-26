import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkNormDto } from './dto/create-work-schedule.dto';
import { UpdateWorkNormDto } from './dto/update-work-schedule.dto';
import { WorkNorm } from './entities/work-schedule.entity';

@Injectable()
export class WorkNormsService {
    constructor(
        @InjectRepository(WorkNorm)
        private workNormsRepository: Repository<WorkNorm>,
    ) {}

    async create(userId: number, WorkNorm: CreateWorkNormDto): Promise<WorkNorm> {
        const existing = await this.workNormsRepository.findOneBy({ name: WorkNorm.name });
        if (existing) {
            throw new BadRequestException(`WorkNorm '${WorkNorm.name}' already exists.`);
        }
        const newWorkNorm = await this.workNormsRepository.save({
            ...WorkNorm,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return newWorkNorm;
    }

    async findAll(): Promise<WorkNorm[]> {
        return await this.workNormsRepository.find();
    }

    async findOne(params): Promise<WorkNorm> {
        const WorkNorm = await this.workNormsRepository.findOne(params);
        if (!WorkNorm) {
            throw new NotFoundException(`WorkNorm could not be found.`);
        }
        return WorkNorm;
    }

    async update(userId: number, id: number, data: UpdateWorkNormDto): Promise<WorkNorm> {
        const WorkNorm = await this.workNormsRepository.findOneBy({ id });
        if (!WorkNorm) {
            throw new NotFoundException(`WorkNorm could not be found.`);
        }
        await this.workNormsRepository.save({
            ...data,
            id,
            updatedUserId: userId,
        });
        const updated = await this.workNormsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(userId: number, id: number): Promise<WorkNorm> {
        const WorkNorm = await this.workNormsRepository.findOneBy({ id });
        if (!WorkNorm) {
            throw new NotFoundException(`WorkNorm could not be found.`);
        }
        await this.workNormsRepository.save({
            ...WorkNorm,
            deletedDate: new Date(),
            deletedUserId: userId,
        });
        return WorkNorm;
    }
}
