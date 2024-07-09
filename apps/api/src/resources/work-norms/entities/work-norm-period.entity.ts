import { Logger } from './../../../resources/abstract/logger.abstract';
import { IWorkNorm, IWorkNormPeriod } from '@repo/shared';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WorkNorm } from './work-norm.entity';

@Entity()
export class WorkNormPeriod extends Logger implements IWorkNormPeriod {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => WorkNorm, (workNorm) => workNorm.periods, { onDelete: 'CASCADE' })
    @JoinColumn()
    workNorm?: IWorkNorm;

    @Column({ type: 'integer' })
    workNormId: number;

    @Column({ type: 'integer' })
    day: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    hours: number;

    @AfterLoad()
    transform() {
        this.hours = Number(this.hours);
    }
}
