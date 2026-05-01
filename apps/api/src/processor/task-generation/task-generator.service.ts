import {
    CompanyService,
    DepartmentService,
    PayPeriodService,
    PaymentsService,
    PersonService,
    PositionsService,
    TasksService,
    UserRoleService,
} from '@/resources';
import { Task } from '@/resources/tasks/entities/task.entity';
import { TaskStatus, TaskType } from '@/types';
import { Inject, Injectable, Logger, Scope, forwardRef } from '@nestjs/common';
import { dropTime } from '@repo/shared';
import { FixedSequenceNumber } from './task-sequence-number';
import { makeTaskGenerator } from './task-generator/base/task-generator.factory';
import { Context } from './task-generator/base/task-generator.context';

@Injectable({ scope: Scope.REQUEST })
export class TaskGenerationService {
    private logger: Logger = new Logger(TaskGenerationService.name);

    constructor(
        @Inject(forwardRef(() => CompanyService)) private companiesService: CompanyService,
        @Inject(forwardRef(() => PayPeriodService)) public payPeriodsService: PayPeriodService,
        @Inject(forwardRef(() => TasksService)) private tasksService: TasksService,
        @Inject(forwardRef(() => DepartmentService)) public departmentService: DepartmentService,
        @Inject(forwardRef(() => PositionsService)) public positionsService: PositionsService,
        @Inject(forwardRef(() => UserRoleService)) public userRoleService: UserRoleService,
        @Inject(forwardRef(() => PaymentsService)) public paymentsService: PaymentsService,
        @Inject(forwardRef(() => PersonService)) public personService: PersonService,
    ) {}

    public async generate(userId: string, companyId: string) {
        this.logger.log(`userId: ${userId}, generate for companyId: ${companyId}`);
        const ctx = await this.makeContext(userId, companyId);
        const currentTaskList: Task[] = [];
        const typeList = [
            TaskType.CreateCompany,
            TaskType.FillDepartmentList,
            TaskType.FillPositionList,
            TaskType.SendIncomeTaxReport,
            TaskType.PostWorkSheet,
            TaskType.PostAccrualDocument,
            TaskType.SendApplicationFss,
            TaskType.PostPaymentFss,
            TaskType.PostAdvancePayment,
            TaskType.PostRegularPayment,
            TaskType.ClosePayPeriod,
            TaskType.HappyBirthday,
        ];
        for (const type of typeList) {
            const generator = makeTaskGenerator(ctx, type);
            const taskList = await generator.getTaskList();
            if (taskList.length) {
                currentTaskList.push(...taskList);
            }
        }
        const { toInsert, toDelete } = this._merge(ctx);
        this._save(ctx, toInsert, toDelete);
    }

    private async makeContext(userId: string, companyId: string): Promise<Context> {
        const company = await this.companiesService.findOne(userId, companyId);
        const payPeriod = await this.payPeriodsService.findOneBy({
            where: { companyId, dateFrom: company.payPeriod },
        });
        return {
            userId,
            company,
            payPeriod,
            priorTaskList: await this.tasksService.findAll({
                companyId,
                onPayPeriodDate: payPeriod.dateFrom,
                relations: false,
            }),
            currentTaskList: [],
            sequenceNumber: new FixedSequenceNumber(),
            payments: await this.paymentsService.findAll({
                companyId,
                accPeriod: payPeriod.dateFrom,
                relations: true,
            }),
            companiesService: this.companiesService,
            payPeriodService: this.payPeriodsService,
            tasksService: this.tasksService,
            departmentService: this.departmentService,
            positionsService: this.positionsService,
            personService: this.personService,
            userRoleService: this.userRoleService,
            paymentsService: this.paymentsService,
        };
    }

    private _merge(ctx: Context): { toInsert: Task[]; toDelete: string[] } {
        const toDelete: string[] = [];
        const processed: string[] = [];
        for (const task of ctx.priorTaskList) {
            const found = ctx.currentTaskList.find(
                (o) =>
                    o.type === task.type &&
                    (o.status === task.status || task.status === TaskStatus.DoneByUser) &&
                    (o.entityId || 0) === (task.entityId || 0) &&
                    dropTime(o.dateFrom) === dropTime(task.dateFrom) &&
                    dropTime(o.dateTo) === dropTime(task.dateTo) &&
                    !processed.find((p) => p === o.id),
            );
            if (found) {
                processed.push(found.id);
            } else {
                toDelete.push(task.id);
            }
        }
        const toInsert = ctx.currentTaskList.filter((task) => !processed.find((id) => id === task.id));
        return { toInsert, toDelete };
    }

    private _save(ctx: Context, toInsert: Task[], toDelete: string[]) {
        for (const id of toDelete) {
            this.tasksService.delete(id);
        }
        for (const { id: _, ...task } of toInsert) {
            this.tasksService.create(ctx.userId, task as any);
        }
    }
}
