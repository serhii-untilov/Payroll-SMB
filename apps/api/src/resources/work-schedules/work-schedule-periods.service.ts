import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkSchedulePeriodDto } from './dto/create-work-schedule-period.dto';
import { UpdateWorkSchedulePeriodDto } from './dto/update-work-schedule-period.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkSchedulePeriod } from './entities/work-schedule-period.entity';
import { Repository } from 'typeorm';
import { IUser } from '@repo/shared';

@Injectable()
export class WorkSchedulePeriodsService {
    constructor(
        @InjectRepository(WorkSchedulePeriod)
        private workSchedulePeriodsRepository: Repository<WorkSchedulePeriod>,
    ) {}

    async create(
        user: IUser,
        workSchedulePeriod: CreateWorkSchedulePeriodDto,
    ): Promise<WorkSchedulePeriod> {
        const existing = await this.workSchedulePeriodsRepository.findOneBy({
            workScheduleId: workSchedulePeriod.workScheduleId,
            day: workSchedulePeriod.day,
        });
        if (existing) {
            throw new BadRequestException(
                `WorkSchedulePeriod '${workSchedulePeriod.workScheduleId}, ${workSchedulePeriod.day}' already exists.`,
            );
        }
        const newWorkSchedulePeriod = await this.workSchedulePeriodsRepository.save({
            ...workSchedulePeriod,
            owner: user,
            createdUser: user,
            updatedUser: user,
        });
        return newWorkSchedulePeriod;
    }

    async findAll(): Promise<WorkSchedulePeriod[]> {
        return await this.workSchedulePeriodsRepository.find();
    }

    async findOne(params): Promise<WorkSchedulePeriod> {
        const WorkSchedulePeriod = await this.workSchedulePeriodsRepository.findOne(params);
        if (!WorkSchedulePeriod) {
            throw new NotFoundException(`WorkSchedulePeriod could not be found.`);
        }
        return WorkSchedulePeriod;
    }

    async update(
        user: IUser,
        id: number,
        data: UpdateWorkSchedulePeriodDto,
    ): Promise<WorkSchedulePeriod> {
        const WorkSchedulePeriod = await this.workSchedulePeriodsRepository.findOneBy({ id });
        if (!WorkSchedulePeriod) {
            throw new NotFoundException(`WorkSchedulePeriod could not be found.`);
        }
        await this.workSchedulePeriodsRepository.save({
            ...data,
            id,
            updatedUser: user,
        });
        const updated = await this.workSchedulePeriodsRepository.findOneOrFail({ where: { id } });
        return updated;
    }

    async remove(user: IUser, id: number): Promise<WorkSchedulePeriod> {
        const WorkSchedulePeriod = await this.workSchedulePeriodsRepository.findOneBy({ id });
        if (!WorkSchedulePeriod) {
            throw new NotFoundException(`WorkSchedulePeriod could not be found.`);
        }
        await this.workSchedulePeriodsRepository.save({
            ...WorkSchedulePeriod,
            deletedDate: new Date(),
            deletedUser: user,
        });
        return WorkSchedulePeriod;
    }
}
