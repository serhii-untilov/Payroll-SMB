import { ApiProperty } from '@nestjs/swagger';

export class CreatePayPeriodDto {
    @ApiProperty() companyId: number;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() state: string; // See PayPeriodState
    @ApiProperty() inBalance?: number;
    @ApiProperty() inCompanyDebt?: number;
    @ApiProperty() inEmployeeDebt?: number;
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
    @ApiProperty() outBalance?: number;
    @ApiProperty() outCompanyDebt?: number;
    @ApiProperty() outEmployeeDebt?: number;
    @ApiProperty() funds?: number;
}
