import {
    HoursByDay,
    WorkNormFact,
    WorkNormPlan,
    WorkNormType,
    monthBegin,
    monthEnd,
    setBit,
} from '@repo/shared';
import { PayrollCalculationService } from '../payrollCalculation.service';
import { WorkNorm } from '../../../resources/work-norms/entities/work-norm.entity';
import { add } from 'date-fns';
import { ConflictException } from '@nestjs/common';

export function getPlan(
    ctx: PayrollCalculationService,
    workNormId: number,
    onDate: Date,
): WorkNormPlan {
    const workNorm = ctx.workNorms.find((o) => o.id === workNormId);
    if (workNorm.type === WorkNormType.WEEKLY) {
        return getPlanForWeekly(workNorm, onDate);
    }
    return { days: 0, hours: 0, mask: 0, hoursByDay: {} };
}

export function getPlanForWeekly(workNorm: WorkNorm, onDate: Date): WorkNormPlan {
    const dateFrom = monthBegin(onDate);
    const dateTo = monthEnd(onDate);
    let days: number = 0;
    let hours: number = 0;
    let mask: number = 0;
    const hoursByDay: HoursByDay = {};
    for (let day = dateFrom.getDate(); day <= dateTo.getDate(); day++) {
        const dayOfWeek = add(dateFrom, { days: day - 1 }).getDay();
        const dayHours = workNorm.periods.find((o) => o.day === dayOfWeek)?.hours || 0;
        if (dayHours) {
            days++;
            hours = hours + dayHours;
            mask = setBit(mask, day - 1, true);
            hoursByDay[day.toString()] = dayHours;
        }
    }
    return { days, hours, mask, hoursByDay };
}

export function getFact(plan: WorkNormPlan, dateFrom: Date, dateTo: Date): WorkNormFact {
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
