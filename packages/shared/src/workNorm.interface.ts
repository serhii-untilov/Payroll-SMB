import { ILogger } from './logger.interface';
import { IWorkNormPeriod } from './workNormPeriod.interface';

export enum WorkNormType {
    WEEKLY = 'weekly', // Fixed hours per week
    PERIODIC = 'periodic', // Fixed hours in a certain period
    VARIABLE = 'variable', // Variable (hours vary every week)
}

export interface IWorkNorm extends ILogger {
    id: number;
    name: string;
    type: string;
    dateFrom?: Date;
    dateTo?: Date;

    periods?: IWorkNormPeriod[];
}

export type ICreateWorkNorm = Omit<
    IWorkNorm,
    | 'id'
    | 'periods'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateWorkNorm = Partial<ICreateWorkNorm>;