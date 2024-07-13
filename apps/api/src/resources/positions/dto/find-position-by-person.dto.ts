export class FindPositionByPersonDto {
    companyId: number;
    personId: number;
    onDate?: Date;
    onPayPeriodDate?: Date;
    relations?: boolean;
}
