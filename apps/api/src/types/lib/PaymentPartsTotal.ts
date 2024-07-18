export type PaymentPartsTotal = {
    accruals?: number;
    deductions?: number;
};

export const defaultPaymentPartsTotal: PaymentPartsTotal = {
    accruals: 0,
    deductions: 0,
};
