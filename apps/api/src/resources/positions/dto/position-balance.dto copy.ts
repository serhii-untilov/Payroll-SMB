import { ApiProperty } from '@nestjs/swagger';
import { IFindPositionBalance, IPositionBalanceExtended } from '@repo/shared';

export class FindAllPositionBalanceDto implements IFindPositionBalance {
    @ApiProperty() companyId: number;
    @ApiProperty() payPeriod?: Date;
}

export class PositionBalanceExtended implements IPositionBalanceExtended {
    id: number;
    positionId: number;
    companyId: number;
    payPeriod: Date;
    inBalance?: number;
    accruals?: number;
    deductions?: number;
    basic?: number;
    adjustments?: number;
    bonuses?: number;
    vacations?: number;
    sicks?: number;
    refunds?: number;
    other_accruals?: number;
    taxes?: number;
    payments?: number;
    other_deductions?: number;
    outBalance?: number;
    cardNumber?: string;
    sequenceNumber?: number;
    dateFrom: Date;
    dateTo: Date;
    personId?: number | null;
    firstName: string;
    lastName: string;
    middleName: string;
    taxId: string;
    departmentId: number;
    departmentName?: string;
    jobId: number;
    jobName?: string;
    workNormId: number;
    workNormName?: string;
    paymentTypeId: number;
    paymentTypeName?: string;
    calcMethod?: string;
    wage: number;
    rate: number;
}
