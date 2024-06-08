import { IPayPeriodCalcMethod } from '@repo/shared';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PayPeriod } from './payPeriod.entity';

@Entity()
export class PayPeriodCalcMethod implements IPayPeriodCalcMethod {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => PayPeriod, (payPeriod) => payPeriod.calcMethods)
    @JoinColumn()
    payPeriod?: PayPeriod;

    @Column({ type: 'integer' })
    payPeriodId: number;

    @Column({ type: 'varchar', length: 30 })
    calcMethod: string; // See enum CalcMethod

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    factSum: number;

    @AfterLoad()
    transform() {
        this.factSum = Number(this.factSum);
    }
}
