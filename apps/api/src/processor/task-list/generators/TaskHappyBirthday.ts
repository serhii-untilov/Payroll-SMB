import { TaskType } from '@repo/shared';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskListService } from '../task-list.service';
import { TaskGenerator } from './abstract/TaskGenerator';

export class TaskHappyBirthday extends TaskGenerator {
    constructor(ctx: TaskListService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const personList = await this.ctx.personsService.findByBirthdayInMonth(
            this.ctx.company.id,
            this.ctx.payPeriod.dateFrom,
        );
        return personList.map((person) => {
            const task = this.makeTask();
            task.dateFrom = new Date(task.dateFrom.setDate(person.birthday.getDate()));
            task.dateTo = new Date(task.dateFrom.setDate(person.birthday.getDate()));
            task.entityId = person.id;
            return task;
        });
    }
}
