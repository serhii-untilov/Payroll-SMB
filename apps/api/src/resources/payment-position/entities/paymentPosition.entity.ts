import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { Payment } from '../../payments/entities/payment.entity';
import { Position } from '../../positions/entities/position.entity';
import { RecordFlag } from './../../../types';

@Entity()
export class PaymentPosition extends BaseEntity {
    @ManyToOne(() => Payment, (payment) => payment.paymentPositions)
    payment?: Relation<Payment>;

    @Column({ type: 'bigint' })
    paymentId: string;

    @ManyToOne(() => Position, { createForeignKeyConstraints: false })
    position?: Relation<Position>;

    @Column({ type: 'bigint' })
    positionId: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    baseSum: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    deductions: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    funds: number;

    @Column({ type: 'bigint', default: 0 })
    @ApiProperty({ enum: RecordFlag, enumName: 'RecordFlags' })
    recordFlags: RecordFlag;

    @AfterLoad()
    transform() {
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.deductions) this.deductions = Number(this.deductions);
        if (this.paySum) this.paySum = Number(this.paySum);
        if (this.funds) this.funds = Number(this.funds);
    }
}
