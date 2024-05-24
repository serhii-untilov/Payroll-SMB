import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessType, ResourceType } from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
    public readonly resourceType = ResourceType.JOB;

    constructor(
        @InjectRepository(Job)
        private repository: Repository<Job>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreateJobDto): Promise<Job> {
        const existing = await this.repository.findOneBy({ name: payload.name });
        if (existing) {
            throw new BadRequestException(`Job '${payload.name}' already exists.`);
        }
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

    async findAll(): Promise<Job[]> {
        return await this.repository.find();
    }

    async findOne(id: number): Promise<Job> {
        const Job = await this.repository.findOneBy({ id });
        if (!Job) {
            throw new NotFoundException(`Job could not be found.`);
        }
        return Job;
    }

    async update(userId: number, id: number, payload: UpdateJobDto): Promise<Job> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        return await this.repository.save({ ...payload, id, updatedUser: userId });
    }

    async remove(userId: number, id: number): Promise<Job> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }
}
