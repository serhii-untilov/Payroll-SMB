import {
    IPaymentGroupsTotal,
    IPaymentPartsTotal,
    IPerson,
    IPosition,
    IPositionHistory,
} from '@repo/shared';

export type BalanceWorkingTime = {
    planDays?: number;
    planHours?: number;
    factDays?: number;
    factHours?: number;
};

export interface IPositionBalance
    extends IPaymentPartsTotal,
        IPaymentGroupsTotal,
        BalanceWorkingTime {
    id?: number | undefined | null;
    position?: IPosition;
    positionId: number;
    payPeriod: Date;
}

export type ICreatePositionBalance = Omit<IPositionBalance, 'id'>;
export type IUpdatePositionBalance = Partial<ICreatePositionBalance>;

export type IFindPositionBalance = {
    companyId: number;
    payPeriod?: Date;
};

export interface IPositionBalanceExtended
    extends IPositionBalance,
        Pick<
            IPosition,
            'companyId' | 'cardNumber' | 'sequenceNumber' | 'personId' | 'dateFrom' | 'dateTo'
        >,
        Pick<IPerson, 'firstName' | 'lastName' | 'middleName' | 'taxId'>,
        Pick<
            IPositionHistory,
            'departmentId' | 'jobId' | 'workNormId' | 'paymentTypeId' | 'wage' | 'rate'
        > {
    departmentName?: string;
    jobName?: string;
    workNormName?: string;
    paymentTypeName?: string;
    calcMethod?: string;
}
