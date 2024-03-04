import { IUser } from './user.interface';

export enum WorkScheduleType {
    WEEKLY = 'weekly', // Fixed hours per week
    PERIODIC = 'periodic', // Fixed hours in a certain period
    VARIABLE = 'variable', // Variable (hours vary every week)
}

export interface IWorkSchedule {
    id: number;
    name: string;
    type: string;
    dateFrom: Date;
    dateTo: Date;

    createdDate: Date;
    createdUser?: IUser;
    createdUserId: number;
    updatedDate: Date;
    updatedUser?: IUser;
    updatedUserId: number;
    deletedDate: Date;
    deletedUser?: IUser;
    deletedUserId?: number;
    version: number;
}

export type ICreateWorkSchedule = Omit<
    IWorkSchedule,
    | 'id'
    | 'createdDate'
    | 'createdUser'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUser'
    | 'updatedUserId: '
    | 'deletedDate'
    | 'deletedUser'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdateWorkSchedule = Partial<ICreateWorkSchedule>;
