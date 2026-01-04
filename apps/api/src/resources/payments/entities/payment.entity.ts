import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, Index, ManyToOne, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { PaymentPosition } from '../../payment-positions/entities/paymentPosition.entity';
import { PaymentStatus, RecordFlag } from './../../../types';
import { Company } from './../../companies/entities/company.entity';
import { PaymentType } from './../../payment-types/entities/payment-type.entity';

@Entity()
@Index('IDX_PAYMENT_COMP_ACC_STATUS', ['companyId', 'accPeriod', 'status'])
export class Payment extends BaseEntity {
    @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    company?: Relation<Company>;

    @Column({ type: 'bigint' })
    companyId: string;

    @Column({ type: 'date' })
    payPeriod: Date;

    @Column({ type: 'date' })
    accPeriod: Date;

    @Column({ type: 'varchar', length: 10 })
    docNumber: string;

    @Column({ type: 'date' })
    docDate: Date;

    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    paymentType?: PaymentType;

    @Column({ type: 'bigint' })
    paymentTypeId: string;

    @Column({ type: 'date' })
    dateFrom: Date; // Between accPeriod.dateFrom and accPeriod.dateTo

    @Column({ type: 'date' })
    dateTo: Date; // Between accPeriod.dateFrom and accPeriod.dateTo

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    baseSum: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    deductions: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    funds: number;

    @Column({ type: 'varchar', length: 10 })
    @ApiProperty({ enum: PaymentStatus, enumName: 'PaymentStatus' })
    status: PaymentStatus;

    @Column({ type: 'bigint', default: 0 })
    @ApiProperty({ enum: RecordFlag, enumName: 'RecordFlags' })
    recordFlags: RecordFlag;

    @Column({ type: 'varchar', length: 256, default: '' })
    description: string;

    @OneToMany(() => PaymentPosition, (paymentPosition) => paymentPosition.payment)
    paymentPositions?: Relation<PaymentPosition>[];

    @AfterLoad()
    transform() {
        this.payPeriod = new Date(this.payPeriod);
        this.accPeriod = new Date(this.accPeriod);
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.deductions) this.deductions = Number(this.deductions);
        if (this.paySum) this.paySum = Number(this.paySum);
        if (this.funds) this.funds = Number(this.funds);
    }
}
