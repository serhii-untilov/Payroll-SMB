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
    other_accruals?: number;
    taxes?: number;
    payments?: number;
    other_deductions?: number;
    outBalance?: number;
    outCompanyDebt?: number;
    outEmployeeDebt?: number;
    funds?: number;
}
