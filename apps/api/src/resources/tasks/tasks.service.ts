import { ConflictException, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceType, TaskStatus, TaskType, monthBegin, monthEnd } from '@repo/shared';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../abstract/availableForUserCompany';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindTaskDto } from './dto/find-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService extends AvailableForUserCompany {
    public readonly resourceType = ResourceType.TASK;

    constructor(
        @InjectRepository(Task)
        private repository: Repository<Task>,
        @Inject(forwardRef(() => AccessService))
        accessService: AccessService,
        @Inject(forwardRef(() => PayPeriodsService))
        private readonly payPeriodsService: PayPeriodsService,
    ) {
        super(accessService);
    }

    async getCompanyId(entityId: number): Promise<number> {
        return (await this.repository.findOneOrFail({ where: { id: entityId } })).companyId;
    }

    async create(userId: number, payload: CreateTaskDto): Promise<Task> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return created;
    }

    async findAll(payload: FindTaskDto): Promise<Task[]> {
        const { companyId, onDate, onPayPeriodDate, relations } = payload;
        if (!companyId) {
            return this._generateFakeTaskList();
        }
        const payPeriod = onPayPeriodDate
            ? await this.payPeriodsService.findOneOrFail({
                  where: {
                      companyId,
                      dateFrom: onPayPeriodDate,
                  },
              })
            : null;
        return sortedTaskList(
            await this.repository.find({
                relations: {
                    company: !!relations,
                },
                where: {
                    companyId,
                    ...(onDate
                        ? {
                              dateFrom: LessThanOrEqual(onDate),
                              dateTo: MoreThanOrEqual(onDate),
                          }
                        : {}),
                    ...(onPayPeriodDate && payPeriod
                        ? {
                              dateFrom: LessThanOrEqual(payPeriod.dateTo),
                              dateTo: MoreThanOrEqual(payPeriod.dateFrom),
                          }
                        : {}),
                },
            }),
        );
    }

    async findOne(id: number, relations?: boolean): Promise<Task> {
        return await this.repository.findOneOrFail({
            where: { id },
            relations: {
                company: !!relations,
            },
        });
    }

    async update(userId: number, id: number, payload: UpdateTaskDto): Promise<Task> {
        const record = await this.repository.findOneOrFail({ where: { id } });
        if (payload.version !== record.version) {
            throw new ConflictException(
                'The record has been updated by another user. Try to edit it after reloading.',
            );
        }
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    // Soft delete
    async remove(userId: number, id: number): Promise<Task> {
        await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        const deleted = await this.repository.findOneOrFail({
            where: { id },
            withDeleted: true,
        });
        return deleted;
    }

    // Hard delete
    async delete(id: number): Promise<Task> {
        const deleted = await this.repository.findOneOrFail({
            where: { id },
            withDeleted: true,
        });
        await this.repository.delete({ id });
        return deleted;
    }

    private async _generateFakeTaskList(): Promise<Task[]> {
        const dateFrom = monthBegin(new Date());
        const dateTo = monthEnd(dateFrom);
        const availableTypeList = [TaskType.CREATE_COMPANY];
        const notAvailableTypeList = [TaskType.FILL_DEPARTMENT_LIST, TaskType.FILL_POSITION_LIST];
        const fakeTaskList = [
            ...availableTypeList.map((o) =>
                Object.assign({ id: 0, type: o, dateFrom, dateTo, status: TaskStatus.TODO }),
            ),
            ...notAvailableTypeList.map((o) =>
                Object.assign({
                    id: 0,
                    type: o,
                    dateFrom,
                    dateTo,
                    status: TaskStatus.NOT_AVAILABLE,
                }),
            ),
        ];
        fakeTaskList.forEach((o, index) => {
            o.id = index;
            o.sequenceNumber = index;
        });
        return fakeTaskList;
    }
}

function sortedTaskList(list: Task[]): Task[] {
    return [...list].sort(
        (a, b) => a.sequenceNumber - b.sequenceNumber || a.dateTo.getTime() - b.dateTo.getTime(),
    );
}
