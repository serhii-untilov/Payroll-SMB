import { Task } from 'src/resources/tasks/entities/task.entity';
import { TaskSequenceNumber } from './abstract/TaskSequenceNumber';
import { TaskType } from '@repo/shared';

export class FixedSequenceNumber extends TaskSequenceNumber {
    get(task: Task) {
        const map = [
            [TaskType.CREATE_USER, 100],
            [TaskType.CREATE_COMPANY, 150],
            [TaskType.FILL_DEPARTMENT_LIST, 200],
            [TaskType.FILL_POSITION_LIST, 250],
            [TaskType.POST_WORK_SHEET, 300],
            [TaskType.POST_ACCRUAL_DOCUMENT, 350],
            [TaskType.POST_PAYMENT_FSS, 400],
            [TaskType.POST_ADVANCE_PAYMENT, 450],
            [TaskType.POST_REGULAR_PAYMENT, 500],
            [TaskType.SEND_APPLICATION_FSS, 550],
            [TaskType.CLOSE_PAY_PERIOD, 600],
            [TaskType.SEND_INCOME_TAX_REPORT, 650],
            [TaskType.HAPPY_BIRTHDAY, 700],
        ];
        const found = map.find((o) => o[0] === task.type);
        if (!found) {
            return new Error('getSequenceNumber: Not found.');
        }
        return found[1];
    }
}
