import { IWorkSchedule, IWorkSchedulePeriod } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { WorkSchedule } from '../../work-schedules/entities/work-schedule.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class WorkSchedulePeriod extends Logger implements IWorkSchedulePeriod {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => WorkSchedule, (workSchedule) => workSchedule.periods)
    workSchedule?: IWorkSchedule;

    @Column({ type: 'integer' })
    workScheduleId: number;

    @Column({ type: 'integer' })
    day: number;

    @Column({ type: 'decimal' })
    hours: number;
}
