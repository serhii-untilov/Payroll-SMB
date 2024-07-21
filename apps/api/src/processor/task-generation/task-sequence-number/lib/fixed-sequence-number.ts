import { Task } from './../../../../resources/tasks/entities/task.entity';
import { TaskType } from '@/types';
import { TaskSequenceNumber } from './../abstract/task-sequence-number';

// https://timmousk.com/blog/typescript-map/
const map: { [id: string]: number } = {};
map[TaskType.CREATE_USER] = 100;
map[TaskType.CREATE_COMPANY] = 150;
map[TaskType.FILL_DEPARTMENT_LIST] = 200;
map[TaskType.FILL_POSITION_LIST] = 250;
map[TaskType.POST_ADVANCE_PAYMENT] = 300;
map[TaskType.POST_WORK_SHEET] = 350;
map[TaskType.POST_ACCRUAL_DOCUMENT] = 400;
map[TaskType.POST_PAYMENT_FSS] = 450;
map[TaskType.POST_REGULAR_PAYMENT] = 500;
map[TaskType.SEND_APPLICATION_FSS] = 550;
map[TaskType.CLOSE_PAY_PERIOD] = 600;
map[TaskType.SEND_INCOME_TAX_REPORT] = 650;
map[TaskType.HAPPY_BIRTHDAY] = 700;

export class FixedSequenceNumber extends TaskSequenceNumber {
    get(task: Task) {
        return map[task.type] || 900;
    }
}
