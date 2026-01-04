import { Task } from './../../resources/tasks/entities/task.entity';
import { PayPeriod } from './../../resources/pay-periods/entities/pay-period.entity';
import { CompanyEntity } from '../../resources/company/entities/company.entity';
import {
    CompanyService,
    DepartmentsService,
    PayPeriodsService,
    PaymentsService,
    PersonService,
    PositionsService,
    TasksService,
    UserRoleService,
} from '@/resources';
import { TaskStatus, TaskType } from '@/types';
import { Inject, Injectable, Logger, NotFoundException, Scope, forwardRef } from '@nestjs/common';
import { dropTime } from '@repo/shared';
import {
    TaskClosePayPeriod,
    TaskCreateCompany,
    TaskFillDepartmentList,
    TaskFillPositionList,
    TaskGenerator,
    TaskHappyBirthday,
    TaskPostAccrualDocument,
    TaskPostAdvancePayment,
    TaskPostFssPayment,
    TaskPostRegularPayment,
    TaskPostWorkSheet,
    TaskSendFssApplication,
    TaskSendIncomeTaxReport,
} from './task-generator';
import { FixedSequenceNumber, TaskSequenceNumber } from './task-sequence-number';
import { Payment } from '@/resources/payments/entities/payment.entity';
import { IdGenerator } from '@/snowflake/snowflake.singleton';

@Injectable({ scope: Scope.REQUEST })
export class TaskGenerationService {
    private _logger: Logger = new Logger(TaskGenerationService.name);
    private _userId: string;
    private _company: CompanyEntity;
    private _payPeriod: PayPeriod;
    private _priorTaskList: Task[] = [];
    private _currentTaskList: Task[] = [];
    private _sequenceNumber: TaskSequenceNumber;
    // private _id: string = 0;
    private _payments: Payment[];

    constructor(
        @Inject(forwardRef(() => CompanyService))
        private companiesService: CompanyService,
        @Inject(forwardRef(() => PayPeriodsService))
        public payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => TasksService))
        private tasksService: TasksService,
        @Inject(forwardRef(() => DepartmentsService))
        public departmentsService: DepartmentsService,
        @Inject(forwardRef(() => PositionsService))
        public positionsService: PositionsService,
        @Inject(forwardRef(() => PersonService))
        public personsService: PersonService,
        @Inject(forwardRef(() => UserRoleService))
        public userCompaniesService: UserRoleService,
        @Inject(forwardRef(() => PaymentsService))
        public paymentsService: PaymentsService,
    ) {
        this._sequenceNumber = new FixedSequenceNumber();
    }

    public get logger() {
        return this._logger;
    }
    public get userId() {
        return this._userId;
    }
    public get company() {
        return this._company;
    }
    public get payPeriod() {
        return this._payPeriod;
    }
    public get priorTaskList() {
        return this._priorTaskList;
    }
    public get currentTaskList() {
        return this._currentTaskList;
    }
    public get sequenceNumber() {
        return this._sequenceNumber;
    }
    public get id() {
        // this._id = this._id + 1;
        // return this._id;
        return IdGenerator.nextId();
    }

    public get payments() {
        return this._payments;
    }

    public async generate(userId: string, companyId: string) {
        this.logger.log(`userId: ${userId}, generate for companyId: ${companyId}`);
        this._userId = userId;
        this._company = await this.companiesService.findOne(userId, companyId);
        this._payPeriod = await this.payPeriodsService.findOneBy({
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        this._priorTaskList = await this.tasksService.findAll({
            companyId,
            onPayPeriodDate: this.payPeriod.dateFrom,
            relations: false,
        });
        // this._id = this.priorTaskList
        //     .filter((o) => o.status === TaskStatus.DoneByUser)
        //     .reduce((a, b) => (a > b.id ? a : b.id), 0);
        this._payments = await this.paymentsService.findAll({
            companyId,
            accPeriod: this.payPeriod.dateFrom,
            relations: true,
        });
        await this._generate();
    }

    private async _generate() {
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
            const generator = this._getTaskGenerator(type);
            const taskList = await generator.getTaskList();
            if (taskList.length) {
                this.currentTaskList.push(...taskList);
            }
        }
        const { toInsert, toDelete } = this._merge();
        this._save(toInsert, toDelete);
    }

    private _merge(): { toInsert: Task[]; toDelete: string[] } {
        const toDelete: string[] = [];
        const processed: string[] = [];
        for (const task of this.priorTaskList) {
            const found = this.currentTaskList.find(
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
        const toInsert = this.currentTaskList.filter((task) => !processed.find((id) => id === task.id));
        return { toInsert, toDelete };
    }

    private _save(toInsert: Task[], toDelete: string[]) {
        for (const id of toDelete) {
            this.tasksService.delete(id);
        }
        for (const { id: _, ...task } of toInsert) {
            this.tasksService.create(this.userId, task);
        }
    }

    private _getTaskGenerator(type: TaskType): TaskGenerator {
        const found = [
            {
                type: TaskType.CreateCompany,
                generator: () => new TaskCreateCompany(this, type),
            },
            {
                type: TaskType.ClosePayPeriod,
                generator: () => new TaskClosePayPeriod(this, type),
            },
            {
                type: TaskType.PostAccrualDocument,
                generator: () => new TaskPostAccrualDocument(this, type),
            },
            {
                type: TaskType.PostAdvancePayment,
                generator: () => new TaskPostAdvancePayment(this, type),
            },
            {
                type: TaskType.SendApplicationFss,
                generator: () => new TaskSendFssApplication(this, type),
            },
            {
                type: TaskType.FillDepartmentList,
                generator: () => new TaskFillDepartmentList(this, type),
            },
            {
                type: TaskType.SendIncomeTaxReport,
                generator: () => new TaskSendIncomeTaxReport(this, type),
            },
            {
                type: TaskType.PostPaymentFss,
                generator: () => new TaskPostFssPayment(this, type),
            },
            {
                type: TaskType.FillPositionList,
                generator: () => new TaskFillPositionList(this, type),
            },
            {
                type: TaskType.PostRegularPayment,
                generator: () => new TaskPostRegularPayment(this, type),
            },
            {
                type: TaskType.PostWorkSheet,
                generator: () => new TaskPostWorkSheet(this, type),
            },
            {
                type: TaskType.HappyBirthday,
                generator: () => new TaskHappyBirthday(this, type),
            },
        ].find((o) => o.type === type);
        if (!found) {
            throw new NotFoundException('Task generator not found.');
        }
        return found.generator();
    }
}
