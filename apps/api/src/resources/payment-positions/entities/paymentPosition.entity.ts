import { ApiProperty } from '@nestjs/swagger';
import { RecordFlags } from '@/types';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { Logger } from '../../abstract/logger.abstract';
import { Payment } from '../../payments/entities/payment.entity';
import { Position } from '../../positions/entities/position.entity';

@Entity()
export class PaymentPosition extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Payment, (payment) => payment.paymentPositions)
    payment?: Relation<Payment>;

    @Column({ type: 'integer' })
    paymentId: number;

    @ManyToOne(() => Position, { createForeignKeyConstraints: false })
    position?: Relation<Position>;

    @Column({ type: 'integer' })
    positionId: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    baseSum: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    deductions: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    funds: number;

    @Column({ type: 'bigint', default: 0 })
    @ApiProperty({ enum: RecordFlags })
    recordFlags: RecordFlags;

    @AfterLoad()
    transform() {
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.deductions) this.deductions = Number(this.deductions);
        if (this.paySum) this.paySum = Number(this.paySum);
        if (this.funds) this.funds = Number(this.funds);
    }
}
