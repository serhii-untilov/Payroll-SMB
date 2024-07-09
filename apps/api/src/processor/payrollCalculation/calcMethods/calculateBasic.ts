import { getWorkingTimeFact, getWorkingTimePlan } from '@/processor/helpers/workingTime.helper';
import { PayPeriod } from '@/resources/pay-periods/entities/payPeriod.entity';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { PositionHistory } from '@/resources/position-history/entities/position-history.entity';
import { NotFoundException } from '@nestjs/common';
import {
    CalcMethod,
    PaymentGroup,
    RecordFlags,
    WorkingTime,
    getMaxDate,
    getMinDate,
} from '@repo/shared';
import { PayrollCalculationService } from '../payrollCalculation.service';

export function calculateBasics(ctx: PayrollCalculationService) {
    for (const accPeriod of ctx.accPeriods) {
        const assignments =
            ctx.position.history?.filter(
                (o) =>
                    o.dateFrom.getTime() <= accPeriod.dateTo.getTime() &&
                    o.dateTo.getTime() >= accPeriod.dateFrom.getTime() &&
                    o.paymentTypeId,
            ) || [];
        const payrolls: Payroll[] = [];
        for (const assignment of assignments) {
            const dateFrom = getMaxDate(
                assignment.dateFrom,
                getMaxDate(accPeriod.dateFrom, ctx.position.dateFrom),
            );
            const dateTo = getMinDate(
                assignment.dateTo,
                getMinDate(accPeriod.dateTo, ctx.position.dateTo),
            );
            const plan = getWorkingTimePlan(ctx, assignment.workNormId, dateFrom);
            const fact = getWorkingTimeFact(plan, dateFrom, dateTo);
            const payroll = makePayroll(ctx, assignment, accPeriod, dateFrom, dateTo, plan, fact);
            const paymentType = ctx.paymentTypes.find((o) => o.id === payroll.paymentTypeId);
            if (!paymentType) {
                throw new NotFoundException('paymentType not found.');
            }
            const calcMethod = getCalcMethod(paymentType.calcMethod);
            payroll.factSum = calcMethod ? calcMethod(payroll) : 0;
            payrolls.push(payroll);
        }
        const basicIds = ctx.paymentTypes
            .filter((o) => o.paymentGroup === PaymentGroup.BASIC)
            .map((o) => o.id);
        ctx.merge(basicIds, accPeriod, payrolls);
    }
}

function makePayroll(
    ctx: PayrollCalculationService,
    assignment: PositionHistory,
    accPeriod: PayPeriod,
    dateFrom: Date,
    dateTo: Date,
    plan: WorkingTime,
    fact: WorkingTime,
): Payroll {
    const payroll = Object.assign({
        id: ctx.getNextPayrollId(),
        positionId: ctx.position.id,
        payPeriod: ctx.payPeriod.dateFrom,
        accPeriod: accPeriod.dateFrom,
        paymentTypeId: assignment.paymentTypeId,
        dateFrom,
        dateTo,
        planDays: plan.days,
        planHours: plan.hours,
        planSum: assignment.wage,
        rate: assignment.rate,
        factDays: fact.days,
        factHours: fact.hours,
        factSum: 0,
        mask1: fact.mask,
        recordFlags: RecordFlags.AUTO,
        planHoursByDay: plan.hoursByDay,
        factHoursByDay: fact.hoursByDay,
    });
    return payroll;
}

function getCalcMethod(calcMethod: string): (payroll: Payroll) => number {
    switch (calcMethod) {
        case CalcMethod.SALARY:
            return calcSalary;
        case CalcMethod.WAGE:
            return calcWage;
        case CalcMethod.COMMISSION:
            return calcCommission;
    }
    throw new NotFoundException('Calc method not found.');
}

function calcSalary(payroll: Payroll) {
    return payroll.planDays
        ? ((payroll.planSum * payroll.factDays) / payroll.planDays) * Math.min(1, payroll.rate)
        : 0;
}

function calcWage(payroll: Payroll) {
    return payroll.planSum * payroll.factHours * Math.min(1, payroll.rate);
}

function calcCommission(payroll: Payroll) {
    return payroll.planSum;
}
