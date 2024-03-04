export enum PaymentPart {
    PAYMENT_ACCRUALS = 'accruals',
    PAYMENT_DEDUCTIONS = 'deductions',
}

export enum PaymentGroup {
    // ACCRUAL part
    BASIC_SALARY = 'basic-salary',
    ALLOWANCES = 'allowances',
    SURCHARGES = 'surcharges',
    BONUSES = 'bonuses',
    VACATIONS = 'vacations',
    SICKS = 'sicks',
    REFUNDS = 'refunds',
    ONE_TIME_ACCRUALS = 'one-time-accruals',
    // DEDUCTION part
    TAXES = 'taxes',
    PAYMENTS = 'payments',
    DEDUCTIONS = 'deductions',
}

export enum PaymentMethod {
    // BASIC_SALARY group
    SALARY = 'salary',
    BY_HOUR = 'by-hour',
    COMMISSION = 'commission',
    // ALLOWANCES group
    ALLOWANCE = 'allowance',
    // SURCHARGES group
    SURCHARGE = 'surcharge',
    // BONUSES group
    BONUS = 'bonus',
    // VACATIONS group
    PAID_VACATION = 'paid-vacation',
    UNPAID_COMPANY_VACATION = 'unpaid-company-vacation',
    UNPAID_OWN_VACATION = 'unpaid-own-vacation',
    // SICKS group
    PAID_SICK_BY_COMPANY = 'paid-sick-by-company',
    PAID_SICK_PAID_BY_SIF = 'paid-sick-by-sif',
    UNPAID_SICK = 'unpaid-sick',
    // REFUNDS group
    INDEXATION = 'indexation',
    // ONE_TIME_ACCRUALS group
    ONE_TIME_ACCRUAL = 'one-time-accrual',
    // TAXES group
    INCOME_TAX = 'income-tax',
    MILITARY_TAX = 'military-tax',
    // PAYMENTS group
    ADVANCE = 'advance',
    SALARY_PAYMENT = 'salary-payment',
    ONE_TIME_PAYMENT = 'one-time-payment',
    // DEDUCTIONS group
    ONE_TIME_DEDUCTION = 'one-time-deduction',
}

export interface IPaymentType {
    id: number;
    name: string;
    paymentGroup: string;
    paymentMethod: string;
}

export type ICreatePaymentType = Omit<IPaymentType, 'id'>;
export type IUpdatePaymentType = Partial<Omit<IPaymentType, 'id'>>;
