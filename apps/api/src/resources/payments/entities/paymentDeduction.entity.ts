import { IPaymentDeduction } from '@repo/shared';
import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentPosition } from './paymentPosition.entity';

@Entity()
export class PaymentDeduction implements IPaymentDeduction {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @ManyToOne(() => PaymentPosition, { createForeignKeyConstraints: false })
    paymentPosition?: PaymentPosition;
    @Column({ type: 'integer' })
    paymentPositionId: number;
    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    paymentType?: PaymentType;
    @Column({ type: 'integer' })
    paymentTypeId: number;
    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    baseSum?: number;
    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    paySum?: number;
    @Column({ type: 'bigint', default: 0 })
    recordFlags?: number; // See enum RecordFlags

    @AfterLoad()
    transform() {
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.paySum) this.paySum = Number(this.paySum);
    }
}
