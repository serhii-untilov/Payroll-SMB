import { IWorkSchedule } from './workSchedule.interface';

export interface IWorkSchedulePeriod {
    id: number;
    workSchedule: IWorkSchedule;
    workScheduleId: number;
    day: number;
    hours: number;
}

export type ICreateWorkSchedulePeriod = Omit<IWorkSchedulePeriod, 'id'>;
export type IUpdateWorkSchedulePeriod = Partial<Omit<IWorkSchedulePeriod, 'id'>>;
