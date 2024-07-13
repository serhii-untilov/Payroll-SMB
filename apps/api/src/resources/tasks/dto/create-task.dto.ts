import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
    @ApiProperty() companyId: number;
    @ApiProperty() type: string; // See enum TaskType
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() sequenceNumber: number;
    @ApiProperty() status: string; // See enum TaskStatus
    @ApiProperty() entityId: number | null;
}
