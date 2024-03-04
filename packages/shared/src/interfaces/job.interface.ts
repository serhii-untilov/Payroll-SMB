export interface IJob {
    id: number;
    name: string;
}

export type ICreateJob = Omit<IJob, 'id'>;
export type IUpdateJob = Partial<Omit<IJob, 'id'>>;
