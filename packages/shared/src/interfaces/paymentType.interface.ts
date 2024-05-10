import { ILogger } from './logger.interface';

export enum PaymentPart {
    PAYMENT_ACCRUALS = 'accruals',
    PAYMENT_DEDUCTIONS = 'deductions',
}

export enum PaymentGroup {
    // ACCRUAL part
    BASIC = 'basic',
    ADJUSTMENTS = 'adjustments',
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

export enum CalcMethod {
    // BASIC_SALARY group
    SALARY = 'salary',
    WAGE = 'wage',
    COMMISSION = 'commission',
    // ADJUSTMENTS group
    ALLOWANCE = 'allowance',
    PAY_EVENING_HOURS = 'pay_evening_hours',
    PAY_NIGHT_HOURS = 'pay_night_hours',
    PAY_OVERTIME = 'pay_overtime',
    PAY_WEEKEND_HOURS = 'pay_weekend_hours',
    PAY_HOLIDAY_HOURS = 'pay_holiday_hours',
    // BONUSES group
    BONUS = 'bonus',
    // VACATIONS group
    PAID_VACATION = 'paid-vacation',
    UNPAID_LEAVE = 'unpaid-leave',
    UNPAID_LEAVE_COMPANY = 'unpaid-leave-company',
    // SICKS group
    PAID_SICK_BY_COMPANY = 'paid-sick-by-company',
    PAID_SICK_PAID_BY_SIF = 'paid-sick-by-sif',
    UNCONFIRMED_SICK = 'unconfirmed-sick',
    // REFUNDS group
    INCOME_INDEXATION = 'income-indexation',
    // ONE_TIME_ACCRUALS group
    ONE_TIME_ACCRUAL = 'one-time-accrual',
    // TAXES group
    INCOME_TAX = 'income-tax',
    MILITARY_TAX = 'military-tax',
    // PAYMENTS group
    ADVANCED_PAYMENT = 'advanced-payment',
    REGULAR_PAYMENT = 'regular-payment',
    FAST_PAYMENT = 'fast-payment',
    // DEDUCTIONS group
    ONE_TIME_DEDUCTION = 'one-time-deduction',
}

export interface IPaymentTypeFilter {
    part?: string;
    groups?: string[];
    methods?: string[];
    ids?: number[];
}

export interface IPaymentType extends ILogger {
    id: number;
    name: string;
    paymentPart: string; // See enum PaymentPart
    paymentGroup: string; // See enum PaymentGroup
    calcMethod: string; // See enum CalcMethod
    description: string;
}

export type ICreatePaymentType = Omit<
    IPaymentType,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdatePaymentType = Partial<ICreatePaymentType>;
