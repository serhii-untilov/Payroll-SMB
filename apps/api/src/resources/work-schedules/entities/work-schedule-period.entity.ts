import { IWorkSchedule, IWorkSchedulePeriod } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { WorkSchedule } from './work-schedule.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';

export class WorkSchedulePeriod extends Logger implements IWorkSchedulePeriod {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => WorkSchedule, (workSchedule) => workSchedule.periods)
    @JoinColumn()
    workSchedule?: IWorkSchedule;

    @Column({ type: 'integer' })
    workScheduleId: number;

    @Column({ type: 'integer' })
    day: number;

    @Column({ type: 'decimal' })
    hours: number;
}
