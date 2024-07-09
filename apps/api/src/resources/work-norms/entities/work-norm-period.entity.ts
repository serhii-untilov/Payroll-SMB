import { IWorkNorm, IWorkNormPeriod } from '@repo/shared';
import { Logger } from '@/resources/logger.abstract';
import { WorkNorm } from './work-norm.entity';
import { Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, Entity, AfterLoad } from 'typeorm';

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
