import { PayFundType } from './../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentPosition } from '../../payment-positions/entities/paymentPosition.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RecordFlags } from '@/types';

@Entity()
export class PaymentFund {
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
    @ApiProperty({ enum: RecordFlags })
    recordFlags: RecordFlags;

    @AfterLoad()
    transform() {
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.paySum) this.paySum = Number(this.paySum);
    }
}
