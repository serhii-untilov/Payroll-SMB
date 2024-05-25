import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PayFundType } from '../../pay-fund-types/entities/pay-fund-type.entity';
import { Position } from '../../positions/entities/position.entity';
import { IPayFund } from '@repo/shared';

@Entity()
export class PayFund implements IPayFund {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Position, { createForeignKeyConstraints: false })
    position?: Position;

    @Column({ type: 'integer' })
    positionId: number;

    @Column({ type: 'date' })
    payPeriod: Date;

    @Column({ type: 'date' })
    accPeriod: Date;

    @ManyToOne(() => PayFundType, { createForeignKeyConstraints: false })
    payFundType?: PayFundType;

    @Column({ type: 'integer' })
    payFundTypeId: number;

    @Column({ type: 'varchar', length: 30 })
    payFundCategory: string; // See enum PayFundCategory

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    incomeSum: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    baseSum: number;

    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    rate: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;

    @AfterLoad()
    transform() {
        this.payPeriod = new Date(this.payPeriod);
        this.accPeriod = new Date(this.accPeriod);
        if (this.incomeSum) this.incomeSum = Number(this.incomeSum);
        if (this.baseSum) this.baseSum = Number(this.baseSum);
        if (this.rate) this.rate = Number(this.rate);
        if (this.paySum) this.paySum = Number(this.paySum);
    }
}
