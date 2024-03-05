import { ILogger } from './logger.interface';
import { IWorkSchedulePeriod } from './workSchedulePeriod.interface';

export enum WorkScheduleType {
    WEEKLY = 'weekly', // Fixed hours per week
    PERIODIC = 'periodic', // Fixed hours in a certain period
    VARIABLE = 'variable', // Variable (hours vary every week)
}

export interface IWorkSchedule extends ILogger {
    id: number;
    name: string;
    type: string;
    dateFrom?: Date;
    dateTo?: Date;

    periods?: IWorkSchedulePeriod[];
}

export type ICreateWorkSchedule = Omit<
    IWorkSchedule,
    | 'id'
    | 'periods'
    | 'createdDate'
    | 'createdUser'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUser'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUser'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateWorkSchedule = Partial<ICreateWorkSchedule>;
