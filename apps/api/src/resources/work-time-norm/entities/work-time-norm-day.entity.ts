import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { WorkTimeNorm } from './work-time-norm.entity';

@Entity({ name: 'work_time_norm_days' })
export class WorkTimeNormDay extends BaseEntity {
    @ManyToOne(() => WorkTimeNorm, (workTimeNorm) => workTimeNorm.days, { onDelete: 'CASCADE' })
    @JoinColumn()
    workTimeNorm?: Relation<WorkTimeNorm>;

    @Column({ type: 'bigint' })
    workTimeNormId: string;

    @Column({ type: 'integer' })
    day: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    hours: number;

    @AfterLoad()
    transform() {
        this.hours = Number(this.hours);
    }
}
