export enum CalcMethod {
    // BASIC_SALARY group
    Salary = 'salary',
    Wage = 'wage',
    Commission = 'commission',
    // ADJUSTMENTS group
    Allowance = 'allowance',
    PaidEveningHours = 'pay_evening_hours',
    PaidNightHours = 'pay_night_hours',
    PaidOvertime = 'pay_overtime',
    PaidWeekendHours = 'pay_weekend_hours',
    PayHolidayHours = 'pay_holiday_hours',
    // BONUSES group
    Bonus = 'bonus',
    // VACATIONS group
    PaidVacation = 'paid-vacation',
    UnpaidLeave = 'unpaid-leave',
    UnpaidLeaveCompany = 'unpaid-leave-company',
    // SICKS group
    PaidSickByCompany = 'paid-sick-by-company',
    PaidSickBySif = 'paid-sick-by-sif',
    UnconfirmedSick = 'unconfirmed-sick',
    // REFUNDS group
    IncomeIndexation = 'income-indexation',
    // ONE_TIME_ACCRUALS group
    OneTimeAccrual = 'one-time-accrual',
    // TAXES group
    IncomeTax = 'income-tax',
    MilitaryTax = 'military-tax',
    // PAYMENTS group
    AdvancedPayment = 'advance-payment',
    RegularPayment = 'regular-payment',
    FastPayment = 'fast-payment',
    SifPayment = 'sif-payment',
    // DEDUCTIONS group
    OneTimeDeduction = 'one-time-deduction',
}