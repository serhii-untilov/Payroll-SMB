import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentPosition } from '../../payment-positions/entities/paymentPosition.entity';

@Entity()
export class PaymentDeduction {
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
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    baseSum: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;
    @Column({ type: 'bigint', default: 0 })
    recordFlags: number; // See enum RecordFlags

    @AfterLoad()
    transform() {
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.paySum) this.paySum = Number(this.paySum);
    }
}
