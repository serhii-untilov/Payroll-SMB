import {
    RecordFlags,
    SourceType,
    WorkNormFact,
    WorkNormPlan,
    getMaxDate,
    getMinDate,
} from '@repo/shared';
import { PayPeriod } from '../../../resources/pay-periods/entities/pay-period.entity';
import { Payroll } from '../../../resources/payrolls/entities/payroll.entity';
import { PositionHistory } from '../../../resources/position-history/entities/position-history.entity';
import { SalaryCalculationService } from '../salary-calculation.service';

export async function calcBasics(ctx: SalaryCalculationService, result: Payroll[]) {
    for (const accPeriod of ctx.accPeriods) {
        const assignments = ctx.position.history.filter(
            (o) =>
                o.dateFrom.getTime() <= accPeriod.dateTo.getTime() &&
                o.dateTo.getTime() >= accPeriod.dateFrom.getTime(),
        );
        for (const assignment of assignments) {
            const dateFrom = getMaxDate(accPeriod.dateFrom, ctx.position.dateFrom);
            const dateTo = getMinDate(accPeriod.dateTo, ctx.position.dateTo);
            const plan = await ctx.workNormsService.getPlan(assignment.workNormId, dateFrom);
            const fact = ctx.workNormsService.getFact(plan, dateFrom, dateTo);
            result.push(calcBasic(ctx, assignment, accPeriod, dateFrom, dateTo, plan, fact));
        }
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
    return {
        id: ctx.getNextId(),
        positionId: ctx.position.id,
        payPeriod: ctx.payPeriod.dateFrom,
        accPeriod: accPeriod.dateFrom,
        paymentTypeId: assignment.paymentTypeId,
        dateFrom,
        dateTo,
        sourceType: SourceType.AUTO,
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
    };
}
