import { IPaymentPosition } from '@repo/shared';
import { Position } from './../../../resources/positions/entities/position.entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from '../../abstract/logger.abstract';
import { Payment } from './payment.entity';

@Entity()
export class PaymentPosition extends Logger implements IPaymentPosition {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @ManyToOne(() => Payment, { createForeignKeyConstraints: false })
    payment?: Payment;
    @Column({ type: 'integer' })
    paymentId: number;
    @ManyToOne(() => Position, { createForeignKeyConstraints: false })
    position?: Position;
    @Column({ type: 'integer' })
    positionId: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    baseSum?: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    deductions?: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    funds?: number;
    @Column({ type: 'bigint', default: 0 })
    recordFlags: number; // See enum RecordFlags

    @AfterLoad()
    transform() {
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.deductions) this.deductions = Number(this.deductions);
        if (this.paySum) this.paySum = Number(this.paySum);
        if (this.funds) this.funds = Number(this.funds);
    }
}
