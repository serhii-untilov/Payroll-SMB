export enum PaymentGroup {
    // ACCRUAL part
    Basic = 'basic',
    Adjustments = 'adjustments',
    Bonuses = 'bonuses',
    Vacations = 'vacations',
    Sicks = 'sicks',
    Refunds = 'refunds',
    OtherAccruals = 'other_accruals',
    // DEDUCTION part
    Taxes = 'taxes',
    Payments = 'payments',
    OtherDeductions = 'other_deductions',
}
