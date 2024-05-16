import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    AccessType,
    HoursByDay,
    ResourceType,
    WorkNormFact,
    WorkNormPlan,
    WorkNormType,
    monthBegin,
    monthEnd,
    setBit,
} from '@repo/shared';
import { Repository } from 'typeorm';
import { AccessService } from '../access/access.service';
import { CreateWorkNormDto } from './dto/create-work-norm.dto';
import { UpdateWorkNormDto } from './dto/update-work-norm.dto';
import { WorkNorm } from './entities/work-norm.entity';
import { add } from 'date-fns';

@Injectable()
export class WorkNormsService {
    public readonly resourceType = ResourceType.WORK_NORM;

    constructor(
        @InjectRepository(WorkNorm)
        private repository: Repository<WorkNorm>,
        @Inject(forwardRef(() => AccessService))
        private accessService: AccessService,
    ) {}

    async create(userId: number, payload: CreateWorkNormDto): Promise<WorkNorm> {
        const existing = await this.repository.findOneBy({ name: payload.name });
        if (existing) {
            throw new ConflictException(`WorkNorm '${payload.name}' already exists.`);
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

    async findAll(relations: boolean): Promise<WorkNorm[]> {
        return await this.repository.find({ relations: { periods: relations } });
    }

    async findOne(id: number, relations: boolean): Promise<WorkNorm> {
        return await this.repository.findOneOrFail({
            relations: { periods: relations },
            where: { id },
        });
    }

    async update(userId: number, id: number, payload: UpdateWorkNormDto): Promise<WorkNorm> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.UPDATE,
        );
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        return await this.repository.save({ ...payload, id, updatedUserId: userId });
    }

    async remove(userId: number, id: number): Promise<WorkNorm> {
        await this.repository.findOneOrFail({ where: { id } });
        await this.accessService.availableForUserOrFail(
            userId,
            this.resourceType,
            AccessType.DELETE,
        );
        return await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
    }

    async getPlan(id: number, onDate: Date): Promise<WorkNormPlan> {
        // TODO
        const workNorm = await this.repository.findOneOrFail({
            where: { id },
            relations: { periods: true },
        });
        if (workNorm.type === WorkNormType.WEEKLY) {
            return this.getPlanForWeekly(workNorm, onDate);
        }
        return { days: 0, hours: 0, mask: 0, hoursByDay: {} };
    }

    getPlanForWeekly(workNorm: WorkNorm, onDate: Date): WorkNormPlan {
        const dateFrom = monthBegin(onDate);
        const dateTo = monthEnd(onDate);
        let days: number = 0;
        let hours: number = 0;
        let mask: number = 0;
        const hoursByDay: HoursByDay = {};
        for (let day = dateFrom.getDate(); day <= dateTo.getDate(); day++) {
            const dayOfWeek = add(dateFrom, { days: day - 1 }).getDay();
            const dayHours = workNorm.periods.find((o) => o.day === dayOfWeek)?.hours || 0;
            if (dayHours) {
                days++;
                hours = hours + dayHours;
                mask = setBit(mask, day - 1, true);
                hoursByDay[day.toString()] = dayHours;
            }
        }
        return { days, hours, mask, hoursByDay };
    }

    getFact(plan: WorkNormPlan, dateFrom: Date, dateTo: Date): WorkNormFact {
        if (monthBegin(dateFrom).getTime() !== monthBegin(dateTo).getTime()) {
            throw new ConflictException(
                'getFact: dateFrom must be in the same month as the dateTo.',
            );
        }
        let days: number = 0;
        let hours: number = 0;
        let mask: number = 0;
        const hoursByDay: HoursByDay = {};
        for (let day = dateFrom.getDate(); day <= dateTo.getDate(); day++) {
            const dayHours = plan.hoursByDay[day.toString()] || 0;
            if (dayHours) {
                days++;
                hours = hours + dayHours;
                mask = setBit(mask, day - 1, true);
                hoursByDay[day.toString()] = dayHours;
            }
        }
        return { days, hours, mask, hoursByDay };
    }
}
