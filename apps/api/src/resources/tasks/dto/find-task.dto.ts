import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';

export class FindTaskDto extends PartialType(Task) {
    @ApiProperty() companyId: number;
    @ApiProperty() onDate?: Date;
    @ApiProperty() onPayPeriodDate?: Date;
    @ApiProperty() relations?: boolean;
}
