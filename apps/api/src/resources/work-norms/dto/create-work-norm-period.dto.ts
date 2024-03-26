import { ICreateWorkNormPeriod } from '@repo/shared';
export class CreateWorkNormPeriodDto implements ICreateWorkNormPeriod {
    id: number;
    workNormId: number;
    day: number;
    hours: number;
}
