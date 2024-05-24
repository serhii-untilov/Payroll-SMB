import { ILogger } from './logger.interface';

export enum PayFundGroup {
    USC = 'USC',
    CUSTOM = 'custom',
}

export enum PayFundCategory {
    EMPLOYEES = 'employees',
    INVALIDITY = 'invalidity',
    MATERNITY = 'maternity',
    GOVERNMENT = 'government',
}

export enum PayFundCalcMethod {
    USC_SALARY = 'USC-salary',
    USC_COMMISSION = 'USC-commission',
    USC_MIN_WAGE = 'USC-min-wage',
    USC_SICK_BY_COMPANY = 'USC-sick-by-company',
    USC_SICK_BY_SIF = 'USC-sick-by-SIF',
    USC_MATERNITY = 'USC-maternity',
    USC_VACATION = 'USC-vacation',
    CUSTOM = 'custom',
}

export interface IPayFundTypeFilter {
    groups?: string[];
    methods?: string[];
    ids?: number[];
}

export interface IPayFundType extends ILogger {
    id: number;
    name: string;
    group: string; // See enum PayFundGroup
    calcMethod: string; // See enum PayFundCalcMethod
    sequence: number;
    description: string;
}

export type ICreatePayFundType = Omit<
    IPayFundType,
    | 'id'
    | 'createdDate'
    | 'createdUserId'
    | 'updatedDate'
    | 'updatedUserId'
    | 'deletedDate'
    | 'deletedUserId'
    | 'version'
>;

export type IUpdatePayFundType = Partial<
    Omit<
        IPayFundType,
        | 'id'
        | 'createdDate'
        | 'createdUserId'
        | 'updatedDate'
        | 'updatedUserId'
        | 'deletedDate'
        | 'deletedUserId'
    >
>;

export type IPayFundCategoriesTotal = {
    employees?: number;
    invalidity?: number;
    maternity?: number;
    government?: number;
};

export const defaultPayFundCategoriesTotal: IPayFundCategoriesTotal = {
    employees: 0,
    invalidity: 0,
    maternity: 0,
    government: 0,
};

export type IPayFundGroupsTotal = {
    USC?: number;
    custom?: number;
};

export const defaultPayFundGroupsTotal: IPayFundGroupsTotal = {
    USC: 0,
    custom: 0,
};
