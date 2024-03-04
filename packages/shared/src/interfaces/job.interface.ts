import { ILogger } from './logger.interface';

export interface IJob extends ILogger {
    id: number;
    name: string;
}

export type ICreateJob = Omit<
    IJob,
    | 'id'
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

export type IUpdateJob = Partial<ICreateJob>;
