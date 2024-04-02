import { ICreatePositionHistory } from '@repo/shared';

export class CreatePositionHistoryDto implements ICreatePositionHistory {
    positionId: number;

    dateFrom: Date;
    dateTo: Date;

    departmentId?: number | null;
    jobId: number | null;
    workNormId: number;
    paymentTypeId: number;

    wage: number;
    rate: number;
}
