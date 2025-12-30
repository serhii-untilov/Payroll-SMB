export class FindPositionByPersonDto {
    companyId: string;
    personId: string;
    onDate?: Date;
    onPayPeriodDate?: Date;
    relations?: boolean;
}
