import { HoursByDay, WorkTime, WorkTimeBalance } from '@/types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getMaxDate, getMinDate, monthBegin, monthEnd, setBit } from '@repo/shared';
import { add, sub } from 'date-fns';
import { PayPeriod } from '../../../resources/pay-periods/entities/pay-period.entity';
import { PositionHistory } from '../../../resources/position-history/entities/position-history.entity';
import { Position } from '../../../resources/positions/entities/position.entity';
import { WorkTimeNorm } from '../../../resources/work-time-norm/entities/work-time-norm.entity';

export function getWorkTimePlan(workTimeNorms: WorkTimeNorm[], workTimeNormId: string | null, onDate: Date): WorkTime {
    if (workTimeNormId) {
        const workTimeNorm = workTimeNorms.find((o) => o.id === workTimeNormId);
        if (workTimeNorm?.days?.length === 7) {
            return getPlanForWeekly(workTimeNorm, onDate);
        }
    }
    return { days: 0, hours: 0, mask: 0, hoursByDay: {} };
}

export function getWorkTimeFact(plan: WorkTime, dateFrom: Date, dateTo: Date): WorkTime {
    if (monthBegin(dateFrom).getTime() !== monthBegin(dateTo).getTime()) {
        throw new HttpException('getFact: dateFrom must be in the same month as the dateTo.', HttpStatus.CONFLICT);
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

export function calcBalanceWorkTime(
    workTimeNorms: WorkTimeNorm[],
    position: Position,
    payPeriod: PayPeriod,
): WorkTimeBalance {
    let plan = new WorkTime();
    let fact = new WorkTime();
    const assignments: PositionHistory[] =
        position?.history?.filter(
            (o) =>
                o.dateFrom.getTime() <= payPeriod.dateTo.getTime() &&
                o.dateTo.getTime() >= payPeriod.dateFrom.getTime(),
        ) || [];
    for (const assignment of assignments) {
        const dateFrom = getMaxDate(assignment.dateFrom, getMaxDate(payPeriod.dateFrom, position.dateFrom));
        const dateTo = getMinDate(assignment.dateTo, getMinDate(payPeriod.dateTo, position.dateTo));
        plan = sumWorkingTime(
            plan,
            getWorkTimeFact(getWorkTimePlan(workTimeNorms, assignment.workTimeNormId, dateFrom), dateFrom, dateTo),
        );
        fact = sumWorkingTime(
            fact,
            // TODO: fact must be from Timesheet
            getWorkTimeFact(plan, dateFrom, dateTo),
        );
    }
    return {
        planDays: plan.days,
        planHours: plan.hours,
        factDays: fact.days,
        factHours: fact.hours,
    };
}

export function sumWorkingTime(wt1: WorkTime, wt2: WorkTime): WorkTime {
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

function getPlanForWeekly(workTimeNorm: WorkTimeNorm, onDate: Date): WorkTime {
    const dateFrom = monthBegin(onDate);
    const dateTo = monthEnd(onDate);
    let days: number = 0;
    let hours: number = 0;
    let mask: number = 0;
    const hoursByDay: HoursByDay = {};
    for (let day = dateFrom.getDate(); day <= dateTo.getDate(); day++) {
        const dayOfWeek = add(dateFrom, { days: day - 1 }).getDay();
        const dayHours = workTimeNorm?.days?.find((o) => o.day === dayOfWeek)?.hours || 0;
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
