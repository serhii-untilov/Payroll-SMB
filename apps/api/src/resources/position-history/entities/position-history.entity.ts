import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { Department } from './../../departments/entities/department.entity';
import { Job } from './../../jobs/entities/job.entity';
import { PaymentType } from './../../payment-types/entities/payment-type.entity';
import { Position } from './../../positions/entities/position.entity';
import { WorkNorm } from './../../work-norms/entities/work-norm.entity';

@Entity()
export class PositionHistory extends BaseEntity {
    @ManyToOne(() => Position, (position) => position.history)
    @JoinColumn()
    position?: Relation<Position>;

    @Column({ type: 'bigint' })
    positionId: string;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @ManyToOne(() => Department, { createForeignKeyConstraints: false })
    @JoinColumn()
    department?: Relation<Department>;

    @Column({ type: 'bigint', nullable: true })
    departmentId: string | null;

    @ManyToOne(() => Job, { createForeignKeyConstraints: false })
    @JoinColumn()
    job?: Relation<Job>;

    @Column({ type: 'bigint', nullable: true })
    jobId: string | null;

    @ManyToOne(() => WorkNorm, { createForeignKeyConstraints: false })
    @JoinColumn()
    workNorm?: Relation<WorkNorm>;

    @Column({ type: 'bigint', nullable: true })
    workNormId: string | null;

    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    @JoinColumn()
    paymentType?: Relation<PaymentType>;

    @Column({ type: 'bigint', nullable: true })
    paymentTypeId: string | null;

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
