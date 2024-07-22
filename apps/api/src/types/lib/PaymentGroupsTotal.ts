export type PaymentGroupsTotal = {
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
};

export const defaultPaymentGroupsTotal: PaymentGroupsTotal = {
    basic: 0,
    adjustments: 0,
    bonuses: 0,
    vacations: 0,
    sicks: 0,
    refunds: 0,
    other_accruals: 0,
    taxes: 0,
    payments: 0,
    other_deductions: 0,
};
