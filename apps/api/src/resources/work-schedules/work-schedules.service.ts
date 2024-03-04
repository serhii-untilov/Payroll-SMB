import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IUser } from '@repo/shared';
import { Repository } from 'typeorm';
import { CreateWorkScheduleDto } from './dto/create-work-schedule.dto';
import { UpdateWorkScheduleDto } from './dto/update-work-schedule.dto';
import { WorkSchedule } from './entities/work-schedule.entity';

@Injectable()
export class WorkSchedulesService {
    constructor(
        @InjectRepository(WorkSchedule)
        private workSchedulesRepository: Repository<WorkSchedule>,
    ) {}

    async create(user: IUser, WorkSchedule: CreateWorkScheduleDto): Promise<WorkSchedule> {
        const existing = await this.workSchedulesRepository.findOneBy({ name: WorkSchedule.name });
        if (existing) {
            throw new BadRequestException(`WorkSchedule '${WorkSchedule.name}' already exists.`);
        }
        const newWorkSchedule = await this.workSchedulesRepository.save({
            ...WorkSchedule,
            owner: user,
            createdUser: user,
            updatedUser: user,
        });
        return newWorkSchedule;
    }

    async findAll(): Promise<WorkSchedule[]> {
        return await this.workSchedulesRepository.find();
    }

    async findOne(params): Promise<WorkSchedule> {
        const WorkSchedule = await this.workSchedulesRepository.findOne(params);
        if (!WorkSchedule) {
            throw new NotFoundException(`WorkSchedule could not be found.`);
        }
        return WorkSchedule;
    }

    async update(user: IUser, id: number, data: UpdateWorkScheduleDto): Promise<WorkSchedule> {
        const WorkSchedule = await this.workSchedulesRepository.findOneBy({ id });
        if (!WorkSchedule) {
            throw new NotFoundException(`WorkSchedule could not be found.`);
        }
        await this.workSchedulesRepository.save({
            ...data,
            id,
            updatedUser: user,
        });
        const updated = await this.workSchedulesRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(user: IUser, id: number): Promise<WorkSchedule> {
        const WorkSchedule = await this.workSchedulesRepository.findOneBy({ id });
        if (!WorkSchedule) {
            throw new NotFoundException(`WorkSchedule could not be found.`);
        }
        await this.workSchedulesRepository.save({
            ...WorkSchedule,
            deletedDate: new Date(),
            deletedUser: user,
        });
        return WorkSchedule;
    }
}
