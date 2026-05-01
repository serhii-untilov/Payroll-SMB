import { getWorkTimeFact, getWorkTimePlan } from '@/processor/helpers';
import { Position } from '@/resources/positions/entities';
import { CalcMethod, PaymentGroup } from '@/types';
import { NotFoundException } from '@nestjs/common';
import { getMaxDate, getMinDate } from '@repo/shared';
import { CalculatePayroll, PayrollContext } from '../base/calculate-payroll.abstract';
import { PayPeriod } from '@/resources/pay-period/entities/pay-period.entity';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';

export class PayrollBasics extends CalculatePayroll {
    constructor(ctx: PayrollContext, position: Position, payrolls: Payroll[], accPeriods: PayPeriod[]) {
        super(ctx, position, payrolls, accPeriods);
    }

    calculate(): void {
        for (const accPeriod of this.accPeriods) {
            const assignments =
                this.position.history?.filter(
                    (o) =>
                        o.dateFrom.getTime() <= accPeriod.dateTo.getTime() &&
                        o.dateTo.getTime() >= accPeriod.dateFrom.getTime() &&
                        o.paymentTypeId,
                ) || [];
            const calculatedPayrolls: Payroll[] = [];
            for (const assignment of assignments) {
                const payroll = this.makePayroll(accPeriod, assignment.paymentTypeId!);
                payroll.dateFrom = getMaxDate(
                    assignment.dateFrom,
                    getMaxDate(accPeriod.dateFrom, this.position.dateFrom),
                );
                payroll.dateTo = getMinDate(assignment.dateTo, getMinDate(accPeriod.dateTo, this.position.dateTo));
                const plan = getWorkTimePlan(this.ctx.workTimeNorms, assignment.workTimeNormId, payroll.dateFrom);
                payroll.planDays = plan.days;
                payroll.planHours = plan.hours;
                payroll.planHoursByDay = plan.hoursByDay;
                payroll.planSum = assignment.wage;
                payroll.rate = assignment.rate;
                const fact = getWorkTimeFact(plan, payroll.dateFrom, payroll.dateTo);
                payroll.factDays = fact.days;
                payroll.factHours = fact.hours;
                payroll.mask1 = fact.mask;
                payroll.factHoursByDay = fact.hoursByDay;
                const paymentType = this.ctx.paymentTypes.find((o) => o.id === assignment.paymentTypeId)!;
                const calcMethod = getCalcMethod(paymentType.calcMethod);
                payroll.factSum = calcMethod ? calcMethod(payroll) : 0;
                calculatedPayrolls.push(payroll);
            }
            const basicIds = this.ctx.paymentTypes
                .filter((o) => o.paymentGroup === PaymentGroup.Basic)
                .map((o) => o.id);
            this.merge(basicIds, accPeriod, calculatedPayrolls);
        }
    }
}

export function calculateBasics(
    ctx: PayrollContext,
    position: Position,
    payrolls: Payroll[],
    accPeriods: PayPeriod[],
): { toInsert: Payroll[]; toDeleteIds: string[] } {
    const calculator = new PayrollBasics(ctx, position, payrolls, accPeriods);
    calculator.calculate();
    return {
        toInsert: calculator.toInsert,
        toDeleteIds: calculator.toDeleteIds,
    };
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
