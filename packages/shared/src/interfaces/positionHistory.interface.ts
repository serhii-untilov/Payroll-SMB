import { IDepartment } from './department.interface';
import { IJob } from './job.interface';
import { ILogger } from './logger.interface';
import { IPaymentType } from './paymentType.interface';
import { IPosition } from './position.interface';
import { IWorkNorm } from './workNorm.interface';

// export enum WorkConditions {
//     FULL_TIME = 'full-time', // Full Time (40, 30+ hours per week)
//     PART_TIME = 'part-time', // Part Time (0-29 hours per week)
//     VARIABLE = 'variable', // Variable (hours vary every week)
//     SEASONAL = 'seasonal', // Seasonal employee
//     OWNERS = 'owners', // Owners
// }

// export enum SalaryType {
//     SALARY = 'salary', // Salary/No Overtime
//     SALARY_OVER_TIME = 'salary-over-time', // Salary/Eligible for Overtime
//     BY_HOUR = 'by-hour', // Paid by the Hour
//     COMMISSION = 'commission-only', // Commission only/No overtime
//     COMMISSION_OVER_TIME = 'commission-over-time', // Commission only/Eligible for overtime
// }

// export enum WagePer {
//     HOUR = 'hour',
//     WEEK = 'week',
//     MONTH = 'month',
//     YEAR = 'year',
// }

export interface IPositionHistory extends ILogger {
    id: number;
    position?: IPosition;
    positionId: number;
    dateFrom: Date;
    dateTo: Date;
    department?: IDepartment;
    departmentId: number | null;
    job?: IJob;
    jobId: number | null;
    workNorm?: IWorkNorm;
    workNormId: number | null;
    paymentType?: IPaymentType;
    paymentTypeId: number | null;
    wage: number;
    rate: number;
}

export type ICreatePositionHistory = Partial<
    Omit<
        IPositionHistory,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
        | 'version'
    >
>;

export type IUpdatePositionHistory = Partial<
    Omit<
        IPositionHistory,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;

export type IFindPositionHistory = {
    positionId: number;
    onDate?: Date;
    onPayPeriodDate?: Date;
    relations?: boolean;
};
