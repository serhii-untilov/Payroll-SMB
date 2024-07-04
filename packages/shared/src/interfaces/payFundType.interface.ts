import { ILogger } from './logger.interface';

export enum PayFundGroup {
    ECB = 'ECB',
    CUSTOM = 'custom',
}

export enum PayFundCategory {
    EMPLOYEES = 'employees',
    INVALIDITY = 'invalidity',
    MATERNITY = 'maternity',
    GOVERNMENT = 'government',
}

export enum PayFundCalcMethod {
    ECB_VACATION = 'ECB-vacation',
    ECB_SALARY = 'ECB-salary',
    ECB_COMMISSION = 'ECB-commission',
    ECB_SICK_BY_COMPANY = 'ECB-sick-by-company',
    ECB_SICK_BY_SIF = 'ECB-sick-by-SIF',
    ECB_MATERNITY = 'ECB-maternity',
    ECB_MIN_WAGE = 'ECB-min-wage',
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
    ECB?: number;
    custom?: number;
};

export const defaultPayFundGroupsTotal: IPayFundGroupsTotal = {
    ECB: 0,
    custom: 0,
};
