import { IWorkNorm } from './workNorm.interface';

export interface IWorkNormPeriod {
    id: number;
    workNorm?: IWorkNorm;
    workNormId: number;
    day: number;
    hours: number;
}

export type ICreateWorkNormPeriod = Omit<IWorkNormPeriod, 'id'>;
export type IUpdateWorkNormPeriod = Partial<ICreateWorkNormPeriod>;
