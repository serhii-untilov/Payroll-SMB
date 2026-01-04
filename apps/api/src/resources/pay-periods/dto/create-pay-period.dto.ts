export class CreatePayPeriodDto {
    companyId: string;
    dateFrom: Date;
    dateTo: Date;
    state: string; // See PayPeriodState
    inBalance?: number;
    inCompanyDebt?: number;
    inEmployeeDebt?: number;
    accruals?: number;
    deductions?: number;
    basic?: number;
    adjustments?: number;
    bonuses?: number;
    vacations?: number;
    sicks?: number;
    refunds?: number;
    otherAccruals?: number;
    taxes?: number;
    payments?: number;
    otherDeductions?: number;
    outBalance?: number;
    outCompanyDebt?: number;
    outEmployeeDebt?: number;
    funds?: number;
}
