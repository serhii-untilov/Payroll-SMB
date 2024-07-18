import { Department, Job, PaymentType, Position, WorkNorm } from '@/resources';
import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { Logger } from './../../abstract/logger.abstract';

@Entity()
export class PositionHistory extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Position, (position) => position.history)
    @JoinColumn()
    position?: Relation<Position>;

    @Column({ type: 'integer' })
    positionId: number;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @ManyToOne(() => Department, { createForeignKeyConstraints: false })
    @JoinColumn()
    department?: Relation<Department>;

    @Column({ type: 'integer', nullable: true })
    departmentId: number | null;

    @ManyToOne(() => Job, { createForeignKeyConstraints: false })
    @JoinColumn()
    job?: Relation<Job>;

    @Column({ type: 'integer', nullable: true })
    jobId: number | null;

    @ManyToOne(() => WorkNorm, { createForeignKeyConstraints: false })
    @JoinColumn()
    workNorm?: Relation<WorkNorm>;

    @Column({ type: 'integer', nullable: true })
    workNormId: number | null;

    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    @JoinColumn()
    paymentType?: Relation<PaymentType>;

    @Column({ type: 'integer', nullable: true })
    paymentTypeId: number | null;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    wage: number;

    @Column({ type: 'decimal', precision: 4, scale: 2, default: 1 })
    rate: number;

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
        this.wage = Number(this.wage);
        this.rate = Number(this.rate);
    }
}
