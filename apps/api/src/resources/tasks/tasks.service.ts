import { Action, Resource, TaskStatus, TaskType } from '@/types';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { monthBegin, monthEnd } from '@repo/shared';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { BaseUserAccess } from '../common/base';
import { PayPeriodService } from '../pay-period/pay-period.service';
import { UserAccessService } from '../user-access/user-access.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { FindAllTaskDto } from './dto/find-all-task.dto';
import { FindOneTaskDto } from './dto/find-one-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService extends BaseUserAccess {
    constructor(
        @InjectRepository(Task) private repository: Repository<Task>,
        @Inject(forwardRef(() => UserAccessService)) userAccessService: UserAccessService,
        @Inject(forwardRef(() => PayPeriodService)) private readonly payPeriodService: PayPeriodService,
    ) {
        super(userAccessService, Resource.Task);
    }

    async getCompanyId(entityId: string): Promise<string> {
        return (await this.repository.findOneOrFail({ where: { id: entityId }, withDeleted: true })).companyId;
    }

    async create(userId: string, payload: CreateTaskDto): Promise<Task> {
        await this.requireAccessOrFail(userId, Action.Create, { companyId: payload.companyId });
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
            ? await this.payPeriodService.findOneBy({
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

    async update(userId: string, id: string, version: number, payload: UpdateTaskDto) {
        await this.requireAccessOrFail(userId, Action.Update, { resourceId: id });
        await this.repository.update(
            { id, version },
            {
                ...payload,
                updatedUserId: userId,
                updatedDate: new Date(),
            },
        );
        return await this.repository.findOneOrFail({ where: { id } });
    }

    // Soft delete
    async remove(userId: string, id: string, version: number): Promise<Task> {
        await this.requireAccessOrFail(userId, Action.Remove, { resourceId: id });
        await this.repository.update({ id, version }, { deletedUserId: userId, deletedDate: new Date() });
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
