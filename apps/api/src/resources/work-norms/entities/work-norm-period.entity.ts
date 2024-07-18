import { Logger } from './../../abstract/logger.abstract';
import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { WorkNorm } from './work-norm.entity';

@Entity()
export class WorkNormPeriod extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => WorkNorm, (workNorm) => workNorm.periods, { onDelete: 'CASCADE' })
    @JoinColumn()
    workNorm?: Relation<WorkNorm>;

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
