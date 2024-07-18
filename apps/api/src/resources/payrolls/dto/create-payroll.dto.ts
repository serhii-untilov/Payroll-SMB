import { HoursByDay } from '@/types';

export class CreatePayrollDto {
    positionId: number;
    payPeriod: Date;
    accPeriod: Date;
    paymentTypeId: number;
    dateFrom: Date;
    dateTo: Date;
    sourceType?: string | null;
    sourceId?: number | null;
    dateBegin?: Date | null;
    dateEnd?: Date | null;
    planDays?: number;
    planHours?: number;
    planSum?: number;
    rate?: number;
    factDays?: number;
    factHours?: number;
    factSum: number;
    mask1?: number;
    mask2?: number;
    recordFlags: number;
    fixedFlags?: number;
    planHoursByDay?: HoursByDay | null;
    factHoursByDay?: HoursByDay | null;
    parentId?: number | null;
}
