import { ICreateWorkSchedulePeriod } from '@repo/shared';
export class CreateWorkSchedulePeriodDto implements ICreateWorkSchedulePeriod {
    id: number;
    workScheduleId: number;
    day: number;
    hours: number;
}
