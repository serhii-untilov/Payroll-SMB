import { IDepartment } from './department.interface';
import { IJob } from './job.interface';
import { ILogger } from './logger.interface';
import { IPosition } from './position.interface';

export enum WagePer {
    HOUR = 'hour',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

export interface IPositionHistory extends ILogger {
    id: number;

    position: IPosition;
    positionId: number;

    dateFrom: Date;
    dateTo: Date;

    department?: IDepartment;
    departmentId: number;

    job?: IJob;
    jobId: number;

    wage: number;
    wagePer: string;
    rate: number;
}

export type ICreatePositionHistory = Omit<
    IPositionHistory,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdatePositionHistory = Partial<ICreatePositionHistory>;
