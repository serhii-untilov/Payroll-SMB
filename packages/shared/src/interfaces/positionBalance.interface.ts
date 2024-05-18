import { IPosition } from '@repo/shared';

export interface IPositionBalance {
    id?: number | undefined | null;
    position?: IPosition;
    positionId: number;
    payPeriod: Date;
    inBalance?: number;
    accrualsSum?: number;
    deductionsSum?: number;
    outBalance?: number;
}

export type ICreatePositionBalance = Omit<IPositionBalance, 'id'>;
export type IUpdatePositionBalance = Partial<ICreatePositionBalance>;
