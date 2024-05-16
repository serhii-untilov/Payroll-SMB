import { HoursByDay, IPayroll } from '@repo/shared';
import { PaymentType } from '../../payment-types/entities/payment-type.entity';
import { Position } from '../../positions/entities/position.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from '../../../resources/abstract/logger.abstract';

@Entity()
export class Payroll extends Logger implements IPayroll {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Position, { createForeignKeyConstraints: false })
    @JoinColumn()
    position?: Position;

    @Column({ type: 'integer' })
    positionId: number;

    @Column({ type: 'date' })
    payPeriod: Date;

    @Column({ type: 'date' })
    accPeriod: Date;

    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    @JoinColumn()
    paymentType?: PaymentType;

    @Column({ type: 'integer' })
    paymentTypeId: number;

    @Column({ type: 'date' })
    dateFrom: Date;

    @Column({ type: 'date' })
    dateTo: Date;

    @Column({ type: 'varchar', length: 10 })
    sourceType: string;

    @Column({ type: 'integer', nullable: true })
    sourceId?: number;

    @Column({ type: 'date', nullable: true })
    dateBegin?: Date;

    @Column({ type: 'date', nullable: true })
    dateEnd?: Date;

    @Column({ type: 'integer', default: 0 })
    planDays?: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    planHours?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    planSum?: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    rate?: number;

    @Column({ type: 'integer', default: 0 })
    factDays?: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    factHours?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    factSum?: number;

    @Column({ type: 'integer', default: 0 })
    mask1?: number;

    @Column({ type: 'integer', default: 0 })
    mask2?: number;

    @Column({ type: 'bigint', default: 0 })
    recordFlags?: number;

    @Column({ type: 'bigint', default: 0 })
    fixedFlags?: number;

    @Column({ type: 'jsonb', nullable: true })
    planHoursByDay: HoursByDay;

    @Column({ type: 'jsonb', nullable: true })
    factHoursByDay: HoursByDay;
}
