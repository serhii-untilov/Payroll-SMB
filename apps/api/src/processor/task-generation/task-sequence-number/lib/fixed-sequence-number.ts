import { Task } from './../../../../resources/tasks/entities/task.entity';
import { TaskType } from '@/types';
import { TaskSequenceNumber } from './../abstract/task-sequence-number';

// https://timmousk.com/blog/typescript-map/
const map: { [id: string]: number } = {};
map[TaskType.CreateUser] = 100;
map[TaskType.CreateCompany] = 150;
map[TaskType.FillDepartmentList] = 200;
map[TaskType.FillPositionList] = 250;
map[TaskType.PostAdvancePayment] = 300;
map[TaskType.PostWorkSheet] = 350;
map[TaskType.PostAccrualDocument] = 400;
map[TaskType.PostPaymentFss] = 450;
map[TaskType.PostRegularPayment] = 500;
map[TaskType.SendApplicationFss] = 550;
map[TaskType.ClosePayPeriod] = 600;
map[TaskType.SendIncomeTaxReport] = 650;
map[TaskType.HappyBirthday] = 700;

export class FixedSequenceNumber extends TaskSequenceNumber {
    get(task: Task) {
        return map[task.type] || 900;
    }
}
