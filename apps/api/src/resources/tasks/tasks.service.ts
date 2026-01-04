import { Resource, TaskStatus, TaskType } from '@/types';
import { checkVersionOrFail } from '@/utils';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { monthBegin, monthEnd } from '@repo/shared';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AvailableForUserCompany } from '../common/base/available-for-user-company';
import { AccessService } from '../access/access.service';
import { PayPeriodsService } from '../pay-periods/pay-periods.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindAllTaskDto } from './dto/find-all-task.dto';
import { FindOneTaskDto } from './dto/find-one-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService extends AvailableForUserCompany {
    public readonly resource = Resource.Task;

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

    async getCompanyId(entityId: string): Promise<string> {
        return (await this.repository.findOneOrFail({ where: { id: entityId }, withDeleted: true })).companyId;
    }

    async create(userId: string, payload: CreateTaskDto): Promise<Task> {
        const created = await this.repository.save({
            ...payload,
            createdUserId: userId,
            updatedUserId: userId,
        });
        return created;
    }

    async findAll(payload: FindAllTaskDto): Promise<Task[]> {
        const { companyId, onDate, onPayPeriodDate, relations } = payload;
        if (!companyId) {
            return this._generateFakeTaskList();
        }
        const payPeriod = onPayPeriodDate
            ? await this.payPeriodsService.findOneBy({
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

    async findOne(id: string, params?: FindOneTaskDto) {
        return await this.repository.findOneOrFail({
            where: { id },
            relations: {
                company: !!params?.relations,
            },
        });
    }

    async update(userId: string, id: string, payload: UpdateTaskDto) {
        const record = await this.repository.findOneOrFail({ where: { id } });
        checkVersionOrFail(record, payload);
        await this.repository.save({
            ...payload,
            id,
            updatedUserId: userId,
            updatedDate: new Date(),
        });
        return await this.repository.findOneOrFail({ where: { id } });
    }

    // Soft delete
    async remove(userId: string, id: string): Promise<Task> {
        await this.repository.save({ id, deletedUserId: userId, deletedDate: new Date() });
        const deleted = await this.repository.findOneOrFail({
            where: { id },
            withDeleted: true,
        });
        return deleted;
    }

    // Hard delete
    async delete(id: string): Promise<Task> {
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
        const availableTypeList = [TaskType.CreateCompany];
        const notAvailableTypeList = [TaskType.FillDepartmentList, TaskType.FillPositionList];
        const fakeTaskList = [
            ...availableTypeList.map((o) =>
                Object.assign({ id: 0, type: o, dateFrom, dateTo, status: TaskStatus.Todo }),
            ),
            ...notAvailableTypeList.map((o) =>
                Object.assign({
                    id: 0,
                    type: o,
                    dateFrom,
                    dateTo,
                    status: TaskStatus.NotAvailable,
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
    return [...list].sort((a, b) => a.sequenceNumber - b.sequenceNumber || a.dateTo.getTime() - b.dateTo.getTime());
}
