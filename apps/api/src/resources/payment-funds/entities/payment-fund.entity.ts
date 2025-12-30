import { PayFundType } from '../../pay-fund-types/entities/pay-fund-type.entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentPosition } from '../../payment-positions/entities/paymentPosition.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RecordFlag } from './../../../types';

@Entity()
export class PaymentFund {
    @PrimaryGeneratedColumn('identity')
    id: string;

    @ManyToOne(() => PaymentPosition, { createForeignKeyConstraints: false })
    paymentPosition?: PaymentPosition;

    @Column({ type: 'bigint' })
    paymentPositionId: string;

    @ManyToOne(() => PayFundType, { createForeignKeyConstraints: false })
    payFundType?: PayFundType;

    @Column({ type: 'bigint' })
    payFundTypeId: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    baseSum: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;

    @Column({ type: 'bigint', default: 0 })
    @ApiProperty({ enum: RecordFlag, enumName: 'RecordFlags' })
    recordFlags: RecordFlag;

    @AfterLoad()
    transform() {
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.paySum) this.paySum = Number(this.paySum);
    }
}
