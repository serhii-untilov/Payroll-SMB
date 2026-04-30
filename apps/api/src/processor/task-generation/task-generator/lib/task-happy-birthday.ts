import { TaskType } from '@/types';
import { TaskGenerator } from '../base/task-generator';
import { Context } from '../base/task-generator.context';
import { Task } from './../../../../resources/tasks/entities/task.entity';

export class TaskHappyBirthday extends TaskGenerator {
    constructor(ctx: Context, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const personList = await this.ctx.personService.findByBirthdayInMonth(
            this.ctx.company.id,
            this.ctx.payPeriod.dateFrom,
        );
        return personList
            .filter((person) => person.birthDate !== null)
            .map((person) => {
                const task = this.makeTask();
                task.dateFrom = new Date(task.dateFrom.setDate(person.birthDate!.getDate()));
                task.dateTo = new Date(task.dateFrom.setDate(person.birthDate!.getDate()));
                task.entityId = person.id;
                return task;
            });
    }
}
