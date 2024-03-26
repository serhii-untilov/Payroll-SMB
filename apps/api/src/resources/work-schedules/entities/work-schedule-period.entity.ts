import { IWorkNorm, IWorkNormPeriod } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { WorkNorm } from './work-schedule.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Entity } from 'typeorm';

@Entity()
export class WorkNormPeriod extends Logger implements IWorkNormPeriod {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => WorkNorm, (workNorm) => workNorm.periods)
    @JoinColumn()
    workNorm?: IWorkNorm;

    @Column({ type: 'integer' })
    workNormId: number;

    @Column({ type: 'integer' })
    day: number;

    @Column({ type: 'decimal' })
    hours: number;
}
