import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, Index, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { PaymentType } from '../../payment-types/entities/payment-type.entity';
import { Position } from '../../positions/entities/position.entity';
import { FixedFlag, HoursByDay, RecordFlag, Resource } from './../../../types';

@Entity()
@Index('IDX_PAYROLL_POSITION_PAY_PERIOD', ['positionId', 'payPeriod'])
@Index('IDX_PAYROLL_SOURCE_TYPE_ID', ['sourceType', 'sourceId'])
export class Payroll extends BaseEntity {
    @ManyToOne(() => Position, { createForeignKeyConstraints: false })
    position?: Relation<Position>;

    @Column({ type: 'bigint' })
    positionId: string;

    @Column({ type: 'date' })
    payPeriod: Date;

    @Column({ type: 'date' })
    accPeriod: Date;

    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    paymentType?: Relation<PaymentType>;

    @Column({ type: 'bigint' })
    paymentTypeId: string;

    @Column({ type: 'date' })
    dateFrom: Date;

    @Column({ type: 'date' })
    dateTo: Date;

    @Column({ type: 'varchar', length: 20, default: '' })
    @ApiProperty({ enum: Resource, enumName: 'Resource' })
    sourceType: Resource;

    @Column({ type: 'bigint', nullable: true })
    sourceId: string | null;

    @Column({ type: 'date', nullable: true })
    dateBegin: Date | null;

    @Column({ type: 'date', nullable: true })
    dateEnd: Date | null;

    @Column({ type: 'integer', default: 0 })
    planDays: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    planHours: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    planSum: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    rate: number;

    @Column({ type: 'integer', default: 0 })
    factDays: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    factHours: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    factSum: number;

    @Column({ type: 'integer', default: 0 })
    mask1: number;

    @Column({ type: 'integer', default: 0 })
    mask2: number;

    @Column({ type: 'bigint' })
    @ApiProperty({ enum: RecordFlag, default: 0, enumName: 'RecordFlags' })
    recordFlags: RecordFlag;

    @Column({ type: 'bigint', default: 0 })
    @ApiProperty({ enum: FixedFlag, enumName: 'FixedFlags' })
    fixedFlags: FixedFlag;

    @Column({ type: 'jsonb', nullable: true })
    planHoursByDay: HoursByDay | null;

    @Column({ type: 'jsonb', nullable: true })
    factHoursByDay: HoursByDay | null;

    @Column({ type: 'bigint', nullable: true })
    parentId: string | null;

    @AfterLoad()
    transform() {
        this.payPeriod = new Date(this.payPeriod);
        this.accPeriod = new Date(this.accPeriod);
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
        if (this.dateBegin) this.dateBegin = new Date(this.dateBegin);
        if (this.dateEnd) this.dateEnd = new Date(this.dateEnd);
        if (this.planHours) this.planHours = Number(this.planHours);
        if (this.planSum) this.planSum = Number(this.planSum);
        if (this.rate) this.rate = Number(this.rate);
        if (this.factHours) this.factHours = Number(this.factHours);
        if (this.factSum) this.factSum = Number(this.factSum);
    }
}
