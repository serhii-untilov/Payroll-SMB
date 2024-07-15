export class FindAllPositionDto {
    companyId: number;
    onDate?: Date;
    onPayPeriodDate?: Date;
    relations?: boolean;
    employeesOnly?: boolean;
    vacanciesOnly?: boolean;
    dismissedOnly?: boolean;
    deletedOnly?: boolean;
    includeDeleted?: boolean;
}
