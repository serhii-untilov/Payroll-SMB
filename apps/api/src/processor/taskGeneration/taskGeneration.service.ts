import { Inject, Injectable, Logger, NotFoundException, Scope, forwardRef } from '@nestjs/common';
import { TaskStatus, TaskType, dropTime } from '@repo/shared';
import { CompaniesService } from '../../resources/companies/companies.service';
import { Company } from '../../resources/companies/entities/company.entity';
import { DepartmentsService } from '../../resources/departments/departments.service';
import { PayPeriod } from '../../resources/pay-periods/entities/payPeriod.entity';
import { PayPeriodsService } from '../../resources/pay-periods/payPeriods.service';
import { PersonsService } from '../../resources/persons/persons.service';
import { PositionsService } from '../../resources/positions/positions.service';
import { Task } from '../../resources/tasks/entities/task.entity';
import { TasksService } from '../../resources/tasks/tasks.service';
import { UsersCompanyService } from './../../resources/users/users-company.service';
import { TaskClosePayPeriod } from './taskGenerator/TaskClosePayPeriod';
import { TaskCreateCompany } from './taskGenerator/TaskCreateCompany';
import { TaskFillDepartmentList } from './taskGenerator/TaskFillDepartmentList';
import { TaskFillPositionList } from './taskGenerator/TaskFillPositionList';
import { TaskHappyBirthday } from './taskGenerator/TaskHappyBirthday';
import { TaskPostAccrualDocument } from './taskGenerator/TaskPostAccrualDocument';
import { TaskPostAdvancePayment } from './taskGenerator/TaskPostAdvancePayment';
import { TaskPostPaymentFss } from './taskGenerator/TaskPostPaymentFss';
import { TaskPostRegularPayment } from './taskGenerator/TaskPostRegularPayment';
import { TaskPostWorkSheet } from './taskGenerator/TaskPostWorkSheet';
import { TaskSendApplicationFss } from './taskGenerator/TaskSendApplicationFss';
import { TaskSendIncomeTaxReport } from './taskGenerator/TaskSendIncomeTaxReport';
import { TaskGenerator } from './taskGenerator/abstract/TaskGenerator';
import { FixedSequenceNumber } from './taskSequenceNumber/FixedSequenceNumber';
import { TaskSequenceNumber } from './taskSequenceNumber/abstract/TaskSequenceNumber';
import { PaymentsService } from './../../resources/payments/payments.service';

@Injectable({ scope: Scope.REQUEST })
export class TaskGenerationService {
    private _logger: Logger = new Logger(TaskGenerationService.name);
    private _userId: number;
    private _company: Company;
    private _payPeriod: PayPeriod;
    private _priorTaskList: Task[] = [];
    private _currentTaskList: Task[] = [];
    private _sequenceNumber: TaskSequenceNumber;
    private _id: number = 0;

    constructor(
        @Inject(forwardRef(() => CompaniesService))
        private companiesService: CompaniesService,
        @Inject(forwardRef(() => PayPeriodsService))
        public payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => TasksService))
        private tasksService: TasksService,
        @Inject(forwardRef(() => DepartmentsService))
        public departmentsService: DepartmentsService,
        @Inject(forwardRef(() => PositionsService))
        public positionsService: PositionsService,
        @Inject(forwardRef(() => PersonsService))
        public personsService: PersonsService,
        @Inject(forwardRef(() => UsersCompanyService))
        public usersCompanyService: UsersCompanyService,
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
        this._id = this._id + 1;
        return this._id;
    }

    public async generate(userId: number, companyId: number) {
        this.logger.log(`userId: ${userId}, generate for companyId: ${companyId}`);
        this._userId = userId;
        this._company = await this.companiesService.findOne(userId, companyId);
        this._payPeriod = await this.payPeriodsService.findOne({
            where: { companyId: this.company.id, dateFrom: this.company.payPeriod },
        });
        this._priorTaskList = await this.tasksService.findAll(userId, {
            companyId,
            onPayPeriodDate: this.payPeriod.dateFrom,
            relations: false,
        });
        this._id = this.priorTaskList
            .filter((o) => o.status === TaskStatus.DONE_BY_USER)
            .reduce((a, b) => (a > b.id ? a : b.id), 0);
        await this._generate();
    }

    private async _generate() {
        const typeList = [
            TaskType.CREATE_COMPANY,
            TaskType.FILL_DEPARTMENT_LIST,
            TaskType.FILL_POSITION_LIST,
            TaskType.SEND_INCOME_TAX_REPORT,
            TaskType.POST_WORK_SHEET,
            TaskType.POST_ACCRUAL_DOCUMENT,
            TaskType.SEND_APPLICATION_FSS,
            TaskType.POST_PAYMENT_FSS,
            TaskType.POST_ADVANCE_PAYMENT,
            TaskType.POST_REGULAR_PAYMENT,
            TaskType.CLOSE_PAY_PERIOD,
            TaskType.HAPPY_BIRTHDAY,
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

    private _merge(): { toInsert: Task[]; toDelete: number[] } {
        const toDelete = [];
        const processed = [];
        for (const task of this.priorTaskList) {
            const found = this.currentTaskList.find(
                (o) =>
                    o.type === task.type &&
                    (o.status === task.status || task.status === TaskStatus.DONE_BY_USER) &&
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
        const toInsert = this.currentTaskList.filter(
            (task) => !processed.find((id) => id === task.id),
        );
        return { toInsert, toDelete };
    }

    private _save(toInsert: Task[], toDelete: number[]) {
        for (const id of toDelete) {
            this.tasksService.delete(id);
        }
        for (const task of toInsert) {
            delete task.id;
            this.tasksService.create(this.userId, task);
        }
    }

    private _getTaskGenerator(type: TaskType): TaskGenerator {
        const found = [
            {
                type: TaskType.CREATE_COMPANY,
                generator: () => new TaskCreateCompany(this, type),
            },
            {
                type: TaskType.CLOSE_PAY_PERIOD,
                generator: () => new TaskClosePayPeriod(this, type),
            },
            {
                type: TaskType.POST_ACCRUAL_DOCUMENT,
                generator: () => new TaskPostAccrualDocument(this, type),
            },
            {
                type: TaskType.POST_ADVANCE_PAYMENT,
                generator: () => new TaskPostAdvancePayment(this, type),
            },
            {
                type: TaskType.SEND_APPLICATION_FSS,
                generator: () => new TaskSendApplicationFss(this, type),
            },
            {
                type: TaskType.FILL_DEPARTMENT_LIST,
                generator: () => new TaskFillDepartmentList(this, type),
            },
            {
                type: TaskType.SEND_INCOME_TAX_REPORT,
                generator: () => new TaskSendIncomeTaxReport(this, type),
            },
            {
                type: TaskType.POST_PAYMENT_FSS,
                generator: () => new TaskPostPaymentFss(this, type),
            },
            {
                type: TaskType.FILL_POSITION_LIST,
                generator: () => new TaskFillPositionList(this, type),
            },
            {
                type: TaskType.POST_REGULAR_PAYMENT,
                generator: () => new TaskPostRegularPayment(this, type),
            },
            {
                type: TaskType.POST_WORK_SHEET,
                generator: () => new TaskPostWorkSheet(this, type),
            },
            {
                type: TaskType.HAPPY_BIRTHDAY,
                generator: () => new TaskHappyBirthday(this, type),
            },
        ].find((o) => o.type === type);
        if (!found) {
            throw new NotFoundException('Task generator not found.');
        }
        return found.generator();
    }
}
