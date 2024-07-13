export class CreatePositionDto {
    companyId: number;
    cardNumber: string; // Identity number (Табельний номер)
    sequenceNumber: number; // Sequence in payroll reports to place managers on top
    description: string;
    personId: number | null; // Vacancy if not defined
    dateFrom: Date; // Hire date or date of open vacancy
    dateTo: Date; // Dismissal date or date of close vacancy
}
