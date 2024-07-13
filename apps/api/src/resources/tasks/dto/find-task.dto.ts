import { PartialType } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class FindTaskDto extends PartialType(Task) {
    companyId: number;
    onDate?: Date;
    onPayPeriodDate?: Date;
    relations?: boolean;
}
