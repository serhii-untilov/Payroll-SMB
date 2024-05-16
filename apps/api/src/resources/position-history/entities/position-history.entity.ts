import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Position } from '../../positions/entities/position.entity';
import { Department } from '../../departments/entities/department.entity';
import { Job } from '../../jobs/entities/job.entity';
import { WorkNorm } from '../../work-norms/entities/work-norm.entity';
import { PaymentType } from '../../payment-types/entities/payment-type.entity';
import { Logger } from '../../abstract/logger.abstract';
import { IPositionHistory } from '@repo/shared';

@Entity()
export class PositionHistory extends Logger implements IPositionHistory {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Position, (position) => position.history)
    @JoinColumn()
    position?: Position;

    @Column({ type: 'integer' })
    positionId: number;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @ManyToOne(() => Department, { createForeignKeyConstraints: false })
    @JoinColumn()
    department?: Department;

    @Column({ type: 'integer', nullable: true })
    departmentId: number | null;

    @ManyToOne(() => Job, { createForeignKeyConstraints: false })
    @JoinColumn()
    job?: Job;

    @Column({ type: 'integer', nullable: true })
    jobId: number | null;

    @ManyToOne(() => WorkNorm, { createForeignKeyConstraints: false })
    @JoinColumn()
    workNorm?: WorkNorm;

    @Column({ type: 'integer', nullable: true })
    workNormId: number | null;

    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    @JoinColumn()
    paymentType?: PaymentType;

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
    }
}
