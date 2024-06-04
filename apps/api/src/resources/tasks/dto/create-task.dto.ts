import { ApiProperty } from '@nestjs/swagger';
import { ICreateTask } from '@repo/shared';

export class CreateTaskDto implements ICreateTask {
    @ApiProperty() companyId: number;
    @ApiProperty() type: string; // See enum TaskType
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() sequenceNumber: number;
    @ApiProperty() status: string; // See enum TaskStatus
}
