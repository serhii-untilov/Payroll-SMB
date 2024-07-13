import { ApiProperty } from '@nestjs/swagger';

export class CreatePositionDto {
    @ApiProperty() companyId: number;
    @ApiProperty() cardNumber: string; // Identity number (Табельний номер)
    @ApiProperty() sequenceNumber: number; // Sequence in payroll reports to place managers on top
    @ApiProperty() description: string;
    @ApiProperty() personId: number | null; // Vacancy if not defined
    @ApiProperty() dateFrom: Date; // Hire date or date of open vacancy
    @ApiProperty() dateTo: Date; // Dismissal date or date of close vacancy
}
