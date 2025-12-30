import { PaymentType } from '../../payment-types/entities/payment-type.entity';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentPosition } from '../../payment-positions/entities/paymentPosition.entity';
import { RecordFlag } from './../../../types';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class PaymentDeduction {
    @PrimaryGeneratedColumn('identity')
    id: string;

    @ManyToOne(() => PaymentPosition, { createForeignKeyConstraints: false })
    paymentPosition?: PaymentPosition;

    @Column({ type: 'bigint' })
    paymentPositionId: string;

    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    paymentType?: PaymentType;

    @Column({ type: 'bigint' })
    paymentTypeId: string;

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
