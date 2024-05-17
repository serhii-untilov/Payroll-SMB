import {
    PaymentGroup,
    RecordFlags,
    WorkNormFact,
    WorkNormPlan,
    getMaxDate,
    getMinDate,
} from '@repo/shared';
import { PayPeriod } from '../../../resources/pay-periods/entities/pay-period.entity';
import { Payroll } from '../../../resources/payrolls/entities/payroll.entity';
import { PositionHistory } from '../../../resources/position-history/entities/position-history.entity';
import { SalaryCalculationService } from '../salary-calculation.service';
import { getFact, getPlan } from '../workingTime/workingTime';

export function calcBasics(ctx: SalaryCalculationService) {
    for (const accPeriod of ctx.accPeriods) {
        const assignments = ctx.position.history.filter(
            (o) =>
                o.dateFrom.getTime() <= accPeriod.dateTo.getTime() &&
                o.dateTo.getTime() >= accPeriod.dateFrom.getTime(),
        );
        const payrolls: Payroll[] = [];
        for (const assignment of assignments) {
            const dateFrom = getMaxDate(accPeriod.dateFrom, ctx.position.dateFrom);
            const dateTo = getMinDate(accPeriod.dateTo, ctx.position.dateTo);
            const plan = getPlan(ctx, assignment.workNormId, dateFrom);
            const fact = getFact(plan, dateFrom, dateTo);
            payrolls.push(calcBasic(ctx, assignment, accPeriod, dateFrom, dateTo, plan, fact));
        }
        ctx.merge(PaymentGroup.BASIC, accPeriod, payrolls);
    }
}

function calcBasic(
    ctx: SalaryCalculationService,
    assignment: PositionHistory,
    accPeriod: PayPeriod,
    dateFrom: Date,
    dateTo: Date,
    plan: WorkNormPlan,
    fact: WorkNormFact,
): Payroll {
    return Object.assign({
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
        factSum: plan.days
            ? ((assignment.wage * fact.days) / plan.days) * Math.min(1, assignment.rate)
            : 0,
        mask1: fact.mask,
        recordFlags: RecordFlags.AUTO,
        planHoursByDay: plan.hoursByDay,
        factHoursByDay: fact.hoursByDay,
    });
}
