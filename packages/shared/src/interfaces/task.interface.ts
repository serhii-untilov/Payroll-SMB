import { ICompany } from './company.interface';
import { ILogger } from './logger.interface';

export enum TaskType {
    CREATE_USER = 'create-user', // Створення користувача
    CREATE_COMPANY = 'create-company', // Створення підприємства
    FILL_DEPARTMENT_LIST = 'fill-department-list', // Заповнення списку підрозділів
    FILL_POSITION_LIST = 'fill-position-list', // Заповнення списку працівників
    POST_WORK_SHEET = 'post-work-sheet', // Заповнення табелю
    POST_ACCRUAL_DOCUMENT = 'post-accrual-document', // Розрахунок разових нарахувань
    SEND_APPLICATION_FSS = 'send-application-fss', // Заявка у ФСС
    POST_PAYMENT_FSS = 'post-payment-fss', // Виплата по заявкам ФСС
    POST_ADVANCE_PAYMENT = 'post-advance-payment', // Виплата авансу
    POST_REGULAR_PAYMENT = 'post-regular-payment', // Виплата зарплати
    CLOSE_PAY_PERIOD = 'close-pay-period', // Закриття розрахункового періоду
    SEND_INCOME_TAX_REPORT = 'send-income-tax-report', // Звіт з ПДФО
    HAPPY_BIRTHDAY = 'happy-birthday', // Привітати з днем народження
}

export enum TaskStatus {
    NOT_AVAILABLE = 'not-available',
    TODO = 'todo',
    IN_PROGRESS = 'in-progress',
    DONE = 'done',
    DONE_BY_USER = 'done-by-user',
}

export interface ITask extends ILogger {
    id: number;
    company?: ICompany;
    companyId: number;
    type: string; // See enum TaskType
    dateFrom: Date;
    dateTo: Date;
    sequenceNumber: number;
    status: string; // See enum TaskStatus
    entityId: number | null;
}

export type ICreateTask = Omit<
    ITask,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateTask = Partial<
    Omit<
        ITask,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;

export type IFindTask = {
    companyId?: number;
    onDate?: Date;
    onPayPeriodDate?: Date;
    relations?: boolean;
};

export interface IFakeTask {
    type: string; // See enum TaskType
    dateFrom: Date;
    dateTo: Date;
    status: string; // See enum TaskStatus
}
