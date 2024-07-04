import { IPaymentFund } from '@repo/shared';
import { PayFundType } from './../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentPosition } from '../payment-positions/entities/paymentPosition.entity';

@Entity()
export class PaymentFund implements IPaymentFund {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @ManyToOne(() => PaymentPosition, { createForeignKeyConstraints: false })
    paymentPosition?: PaymentPosition;
    @Column({ type: 'integer' })
    paymentPositionId: number;
    @ManyToOne(() => PayFundType, { createForeignKeyConstraints: false })
    payFundType?: PayFundType;
    @Column({ type: 'integer' })
    payFundTypeId: number;
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
