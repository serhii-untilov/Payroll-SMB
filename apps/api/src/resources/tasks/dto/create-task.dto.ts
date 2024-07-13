export class CreateTaskDto {
    companyId: number;
    type: string; // See enum TaskType
    dateFrom: Date;
    dateTo: Date;
    sequenceNumber: number;
    status: string; // See enum TaskStatus
    entityId: number | null;
}
