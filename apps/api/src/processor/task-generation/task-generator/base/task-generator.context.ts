import {
    CompanyService,
    DepartmentService,
    PaymentsService,
    PayPeriodsService,
    PersonService,
    PositionsService,
    TasksService,
    UserRoleService,
} from '@/resources';
import { CompanyReadDto } from '@/resources/company/dto/company-read.dto';
import { PayPeriod } from '@/resources/pay-periods/entities';
import { Payment } from '@/resources/payments/entities/payment.entity';
import { Task } from '@/resources/tasks/entities/task.entity';
import { TaskSequenceNumber } from '../../task-sequence-number';

export type Context = {
    userId: string;
    company: CompanyReadDto;
    payPeriod: PayPeriod;
    priorTaskList: Task[];
    currentTaskList: Task[];
    sequenceNumber: TaskSequenceNumber;
    payments: Payment[];
    companiesService: CompanyService;
    payPeriodService: PayPeriodsService;
    tasksService: TasksService;
    departmentService: DepartmentService;
    positionsService: PositionsService;
    personService: PersonService;
    userRoleService: UserRoleService;
    paymentsService: PaymentsService;
};
