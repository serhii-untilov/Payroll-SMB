import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PayPeriod } from './pay-period.entity';
import { IPayPeriodPaymentGroup } from '@repo/shared';

@Entity()
export class PayPeriodPaymentGroup implements IPayPeriodPaymentGroup {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => PayPeriod, (payPeriod) => payPeriod.paymentGroups)
    // @ManyToOne(() => PayPeriod, { createForeignKeyConstraints: false })
    @JoinColumn()
    payPeriod?: PayPeriod;

    @Column({ type: 'integer' })
    payPeriodId: number;

    @Column({ type: 'varchar', length: 30 })
    paymentGroup: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    factSum: number;

    @AfterLoad()
    transform() {
        this.factSum = Number(this.factSum);
    }
}
