import { ICreateWorkSchedule } from '@repo/shared';

export class CreateWorkScheduleDto implements ICreateWorkSchedule {
    id: number;
    name: string;

    type: string;
    dateFrom: Date;
    dateTo: Date;
}
