import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';
import { IFindTask } from '@repo/shared';

export class FindTaskDto extends PartialType(Task) implements IFindTask {
    @ApiProperty() companyId: number;
    @ApiProperty() onDate?: Date;
    @ApiProperty() onPayPeriodDate?: Date;
    @ApiProperty() relations?: boolean;
}
