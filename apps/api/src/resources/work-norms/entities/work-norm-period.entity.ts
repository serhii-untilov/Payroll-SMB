import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { WorkNorm } from './work-norm.entity';

@Entity()
export class WorkNormPeriod extends BaseEntity {
    @ManyToOne(() => WorkNorm, (workNorm) => workNorm.periods, { onDelete: 'CASCADE' })
    @JoinColumn()
    workNorm?: Relation<WorkNorm>;

    @Column({ type: 'bigint' })
    workNormId: string;

    @Column({ type: 'integer' })
    day: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    hours: number;

    @AfterLoad()
    transform() {
        this.hours = Number(this.hours);
    }
}
