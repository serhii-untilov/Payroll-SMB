import { PositionHistory } from '@/resources/position-history/entities/position-history.entity';
import { WorkNorm } from '@/resources/work-norms/entities/work-norm.entity';
import { ConflictException } from '@nestjs/common';
import {
    BalanceWorkingTime,
    HoursByDay,
    WorkNormType,
    WorkingTime,
    getMaxDate,
    getMinDate,
    monthBegin,
    monthEnd,
    setBit,
} from '@repo/shared';
import { add, sub } from 'date-fns';
import { PayrollCalculationService } from '../payrollCalculation/payrollCalculation.service';

export function getWorkingTimePlan(
    ctx: PayrollCalculationService,
    workNormId: number | null,
    onDate: Date,
): WorkingTime {
    if (workNormId) {
        const workNorm = ctx.workNorms.find((o) => o.id === workNormId);
        if (workNorm?.type === WorkNormType.WEEKLY) {
            return getPlanForWeekly(workNorm, onDate);
        }
    }
    return { days: 0, hours: 0, mask: 0, hoursByDay: {} };
}

export function getWorkingTimeFact(plan: WorkingTime, dateFrom: Date, dateTo: Date): WorkingTime {
    if (monthBegin(dateFrom).getTime() !== monthBegin(dateTo).getTime()) {
        throw new ConflictException('getFact: dateFrom must be in the same month as the dateTo.');
    }
    let days: number = 0;
    let hours: number = 0;
    let mask: number = 0;
    const hoursByDay: HoursByDay = {};
    for (let day = dateFrom.getDate(); day <= dateTo.getDate(); day++) {
        const dayHours = plan.hoursByDay[day.toString()] || 0;
        if (dayHours) {
            days++;
            hours = hours + dayHours;
            mask = setBit(mask, day - 1, true);
            hoursByDay[day.toString()] = dayHours;
        }
    }
    return { days, hours, mask, hoursByDay };
}

export function calcBalanceWorkingTime(ctx: PayrollCalculationService): BalanceWorkingTime {
    let plan = new WorkingTime();
    let fact = new WorkingTime();
    const assignments: PositionHistory[] =
        ctx.position?.history?.filter(
            (o) =>
                o.dateFrom.getTime() <= ctx.payPeriod.dateTo.getTime() &&
                o.dateTo.getTime() >= ctx.payPeriod.dateFrom.getTime(),
        ) || [];
    for (const assignment of assignments) {
        const dateFrom = getMaxDate(
            assignment.dateFrom,
            getMaxDate(ctx.payPeriod.dateFrom, ctx.position.dateFrom),
        );
        const dateTo = getMinDate(
            assignment.dateTo,
            getMinDate(ctx.payPeriod.dateTo, ctx.position.dateTo),
        );
        plan = sumWorkingTime(
            plan,
            getWorkingTimeFact(
                getWorkingTimePlan(ctx, assignment.workNormId, dateFrom),
                dateFrom,
                dateTo,
            ),
        );
        fact = sumWorkingTime(
            fact,
            // TODO: fact must be from TimeSheet
            getWorkingTimeFact(plan, dateFrom, dateTo),
        );
    }
    return {
        planDays: plan.days,
        planHours: plan.hours,
        factDays: fact.days,
        factHours: fact.hours,
    };
}

export function sumWorkingTime(wt1: WorkingTime, wt2: WorkingTime): WorkingTime {
    let days: number = 0;
    let hours: number = 0;
    let mask: number = 0;
    const hoursByDay: HoursByDay = {};
    for (let day = 1; day <= 31; day++) {
        const dayHours = wt1.hoursByDay[day.toString()] || wt2.hoursByDay[day.toString()] || 0;
        if (dayHours) {
            days++;
            hours = hours + dayHours;
            mask = setBit(mask, day - 1, true);
            hoursByDay[day.toString()] = dayHours;
        }
    }
    return { days, hours, mask, hoursByDay };
}

function getPlanForWeekly(workNorm: WorkNorm, onDate: Date): WorkingTime {
    const dateFrom = monthBegin(onDate);
    const dateTo = monthEnd(onDate);
    let days: number = 0;
    let hours: number = 0;
    let mask: number = 0;
    const hoursByDay: HoursByDay = {};
    for (let day = dateFrom.getDate(); day <= dateTo.getDate(); day++) {
        const dayOfWeek = add(dateFrom, { days: day - 1 }).getDay();
        const dayHours = workNorm?.periods?.find((o) => o.day === dayOfWeek)?.hours || 0;
        if (dayHours) {
            days++;
            hours = hours + dayHours;
            mask = setBit(mask, day - 1, true);
            hoursByDay[day.toString()] = dayHours;
        }
    }
    return { days, hours, mask, hoursByDay };
}

export function getWorkDayBeforeOrEqual(date: Date): Date {
    let d = new Date(date);
    while (d.getDay() === 0 || d.getDay() === 6) {
        d = sub(d, { days: 1 });
    }
    return d;
}
