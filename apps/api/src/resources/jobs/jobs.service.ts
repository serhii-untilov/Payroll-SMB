import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './entities/job.entity';
import { IUser } from '@repo/shared';

@Injectable()
export class JobsService {
    constructor(
        @InjectRepository(Job)
        private jobsRepository: Repository<Job>,
    ) {}

    async create(user: IUser, Job: CreateJobDto): Promise<Job> {
        const existing = await this.jobsRepository.findOneBy({ name: Job.name });
        if (existing) {
            throw new BadRequestException(`Job '${Job.name}' already exists.`);
        }
        const newJob = await this.jobsRepository.save({
            ...Job,
            // owner: user,
            createdUser: user,
            updatedUser: user,
        });
        return newJob;
    }

    async findAll(): Promise<Job[]> {
        return await this.jobsRepository.find();
    }

    async findOne(params): Promise<Job> {
        const Job = await this.jobsRepository.findOne(params);
        if (!Job) {
            throw new NotFoundException(`Job could not be found.`);
        }
        return Job;
    }

    async update(user: IUser, id: number, data: UpdateJobDto): Promise<Job> {
        const Job = await this.jobsRepository.findOneBy({ id });
        if (!Job) {
            throw new NotFoundException(`Job could not be found.`);
        }
        await this.jobsRepository.save({
            ...data,
            id,
            updatedUser: user,
        });
        const updated = await this.jobsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(user: IUser, id: number): Promise<Job> {
        const Job = await this.jobsRepository.findOneBy({ id });
        if (!Job) {
            throw new NotFoundException(`Job could not be found.`);
        }
        await this.jobsRepository.save({
            ...Job,
            deletedDate: new Date(),
            deletedUser: user,
        });
        return Job;
    }
}
