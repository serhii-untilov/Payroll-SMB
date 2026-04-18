import { PositionHistory } from './../../../../resources/position-history/entities/position-history.entity';
import { Payroll } from './../../../../resources/payrolls/entities/payroll.entity';
import { PayPeriod } from './../../../../resources/pay-periods/entities/pay-period.entity';
import { getWorkTimeFact, getWorkTimePlan } from '@/processor/helpers';
import { CalcMethod, RecordFlag, WorkTime } from '@/types';
import { NotFoundException } from '@nestjs/common';
import { PaymentGroup } from '@/types';
import { getMaxDate, getMinDate } from '@repo/shared';
import { PayrollCalculationService } from './../../payroll-calculation.service';
import { CalculatePayroll, PayrollContext } from '../base/calculate-payroll.abstract';
import { Position } from '@/resources/positions/entities';
import { PaymentType } from '@/resources/payment-types/entities/payment-type.entity';

export class PayrollBasics extends CalculatePayroll {
    constructor(
        ctx: PayrollContext,
        position: Position,
        payrolls: Payroll[],
        paymentType: PaymentType,
        accPeriods: PayPeriod[],
    ) {
        super(ctx, position, payrolls, paymentType, accPeriods);
    }

    async calculate(): Promise<Payroll[]> {
        const payrolls: Payroll[] = [];
        for (const accPeriod of this.accPeriods) {
            const assignments =
                this.position.history?.filter(
                    (o) =>
                        o.dateFrom.getTime() <= accPeriod.dateTo.getTime() &&
                        o.dateTo.getTime() >= accPeriod.dateFrom.getTime() &&
                        o.paymentTypeId,
                ) || [];
            for (const assignment of assignments) {
                const payroll = this.makePayroll(accPeriod);
                payroll.paymentTypeId = assignment.paymentTypeId;
                payroll.dateFrom = getMaxDate(
                    assignment.dateFrom,
                    getMaxDate(accPeriod.dateFrom, this.position.dateFrom),
                );
                payroll.dateTo = getMinDate(assignment.dateTo, getMinDate(accPeriod.dateTo, this.position.dateTo));
                const plan = getWorkTimePlan(this.ctx.workTimeNorms, assignment.workTimeNormId, payroll.dateFrom);
                payroll.planDays = plan.days;
                payroll.planHours = plan.hours;
                payroll.planHoursByDay = plan.hoursByDay;
                const fact = getWorkTimeFact(plan, payroll.dateFrom, payroll.dateTo);
                payroll.factDays = fact.days;
                payroll.factHours = fact.hours;
                payroll.mask1 = fact.mask;
                payroll.factHoursByDay = fact.hoursByDay;
                payroll.paymentType = this.ctx.paymentTypes.find((o) => o.id === payroll.paymentTypeId);
                const calcMethod = getCalcMethod(paymentType.calcMethod);
                payroll.factSum = calcMethod ? calcMethod(payroll) : 0;
                payrolls.push(payroll);
            }
            const basicIds = this.ctx.paymentTypes
                .filter((o) => o.paymentGroup === PaymentGroup.Basic)
                .map((o) => o.id);
            this.ctx.merge(basicIds, accPeriod, payrolls);
        }
        return [];
    }
}

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
            const dateFrom = getMaxDate(assignment.dateFrom, getMaxDate(accPeriod.dateFrom, ctx.position.dateFrom));
            const dateTo = getMinDate(assignment.dateTo, getMinDate(accPeriod.dateTo, ctx.position.dateTo));
            const plan = getWorkTimePlan(ctx.workTimeNorms, assignment.workTimeNormId, dateFrom);
            const fact = getWorkTimeFact(plan, dateFrom, dateTo);
            const payroll = this.makePayroll(ctx, assignment, accPeriod, dateFrom, dateTo, plan, fact);
            const paymentType = ctx.paymentTypes.find((o) => o.id === payroll.paymentTypeId);
            const calcMethod = getCalcMethod(paymentType.calcMethod);
            payroll.factSum = calcMethod ? calcMethod(payroll) : 0;
            payrolls.push(payroll);
        }
        const basicIds = ctx.paymentTypes.filter((o) => o.paymentGroup === PaymentGroup.Basic).map((o) => o.id);
        ctx.merge(basicIds, accPeriod, payrolls);
    }
}

function makePayroll(
    ctx: PayrollCalculationService,
    assignment: PositionHistory,
    accPeriod: PayPeriod,
    dateFrom: Date,
    dateTo: Date,
    plan: WorkTime,
    fact: WorkTime,
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
        recordFlags: RecordFlag.Auto,
        planHoursByDay: plan.hoursByDay,
        factHoursByDay: fact.hoursByDay,
    });
    return payroll;
}

function getCalcMethod(calcMethod: string): (payroll: Payroll) => number {
    switch (calcMethod) {
        case CalcMethod.Salary:
            return calcSalary;
        case CalcMethod.Wage:
            return calcWage;
        case CalcMethod.Commission:
            return calcCommission;
    }
    throw new NotFoundException('Calc method not found.');
}

function calcSalary(payroll: Payroll) {
    return payroll.planDays ? ((payroll.planSum * payroll.factDays) / payroll.planDays) * Math.min(1, payroll.rate) : 0;
}

function calcWage(payroll: Payroll) {
    return payroll.planSum * payroll.factHours * Math.min(1, payroll.rate);
}

function calcCommission(payroll: Payroll) {
    return payroll.planSum;
}
