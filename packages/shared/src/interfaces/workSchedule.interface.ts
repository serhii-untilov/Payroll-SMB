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
}

export type ICreateWorkSchedule = Omit<IWorkSchedule, 'id'>;
export type IUpdateWorkSchedule = Partial<Omit<IWorkSchedule, 'id'>>;
