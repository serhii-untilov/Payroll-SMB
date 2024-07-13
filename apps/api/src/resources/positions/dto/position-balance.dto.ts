import { ApiProperty } from '@nestjs/swagger';

export class FindAllPositionBalanceDto {
    @ApiProperty() companyId: number;
    @ApiProperty() payPeriod?: Date;
}

export class PositionBalanceExtended {
    @ApiProperty() id: number;
    @ApiProperty() positionId: number;
    @ApiProperty() companyId: number;
    @ApiProperty() payPeriod: Date;
    @ApiProperty() inBalance?: number;
    @ApiProperty() accruals?: number;
    @ApiProperty() deductions?: number;
    @ApiProperty() basic?: number;
    @ApiProperty() adjustments?: number;
    @ApiProperty() bonuses?: number;
    @ApiProperty() vacations?: number;
    @ApiProperty() sicks?: number;
    @ApiProperty() refunds?: number;
    @ApiProperty() other_accruals?: number;
    @ApiProperty() taxes?: number;
    @ApiProperty() payments?: number;
    @ApiProperty() other_deductions?: number;
    @ApiProperty() planDays: number;
    @ApiProperty() planHours: number;
    @ApiProperty() factDays: number;
    @ApiProperty() factHours: number;
    @ApiProperty() outBalance?: number;
    @ApiProperty() cardNumber: string;
    @ApiProperty() sequenceNumber: number;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() personId: number | null;
    @ApiProperty() firstName: string;
    @ApiProperty() lastName: string;
    @ApiProperty() middleName: string;
    @ApiProperty() taxId: string;
    @ApiProperty() departmentId: number;
    @ApiProperty() departmentName?: string;
    @ApiProperty() jobId: number;
    @ApiProperty() jobName?: string;
    @ApiProperty() workNormId: number;
    @ApiProperty() workNormName?: string;
    @ApiProperty() paymentTypeId: number;
    @ApiProperty() paymentTypeName?: string;
    @ApiProperty() calcMethod?: string;
    @ApiProperty() wage: number;
    @ApiProperty() rate: number;
    @ApiProperty() paySumECB?: number;
    @ApiProperty() calcMethodBalance: { calcMethod: string; factSum: number }[];
}
