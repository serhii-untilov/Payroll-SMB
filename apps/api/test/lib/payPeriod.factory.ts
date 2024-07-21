import { PayPeriod } from './../../src/resources/pay-periods/entities/pay-period.entity';
import { PayPeriodState } from '@/types';
import { incrementalNumber } from '@ngneat/falso';
import { maxDate, minDate } from '@repo/shared';

const factory = incrementalNumber();

export const createMockPayPeriod = (data?: Partial<PayPeriod>) => {
    const id = factory();

    return {
        id,
        companyId: 1,
        dateFrom: minDate(),
        dateTo: maxDate(),
        state: PayPeriodState.OPENED,
        inBalance: 0,
        inCompanyDebt: 0,
        inEmployeeDebt: 0,
        accruals: 0,
        deductions: 0,
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
        outBalance: 0,
        outCompanyDebt: 0,
        outEmployeeDebt: 0,
        funds: 0,
        ...data,
    };
};
