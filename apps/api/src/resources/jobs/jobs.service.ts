import { AccessType, ResourceType } from '@/types';
import { checkVersionOrFail } from '@/utils';
import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from './entities/job.entity';

@Injectable()
export class JobsService {
    public readonly resourceType = ResourceType.Job;

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
            AccessType.Create,
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
            AccessType.Update,
        );
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        return await this.repository.save({
            ...payload,
            id,
            updatedUser: userId,
            updatedDate: new Date(),
        });
    }

    async remove(userId: number, id: number): Promise<Job> {
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.Delete,
        );
        await this.repository.findOneOrFail({ where: { id } });
        return await this.repository.save({
            id,
            deletedUserId: userId,
            deletedDate: new Date(),
        });
    }
}
