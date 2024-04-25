import { ICreatePosition } from '@repo/shared';

export class CreatePositionDto implements ICreatePosition {
    companyId: number;

    cardNumber: string; // Identity number (Табельний номер)
    sequenceNumber: number; // Sequence in payroll reports to place managers on top
    description: string;

    personId?: number | null; // Vacancy if not defined

    dateFrom?: Date | null; // Hire date or date of open vacancy
    dateTo?: Date | null; // Dismissal date or date of close vacancy
}
