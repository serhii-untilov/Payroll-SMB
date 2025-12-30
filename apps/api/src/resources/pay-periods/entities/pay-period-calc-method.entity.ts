import { ApiProperty } from '@nestjs/swagger';
import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { CalcMethod } from './../../../types';
import { PayPeriod } from './pay-period.entity';

@Entity()
export class PayPeriodCalcMethod {
    @PrimaryGeneratedColumn('identity')
    id: string;

    @ManyToOne(() => PayPeriod, (payPeriod) => payPeriod.calcMethods)
    @JoinColumn()
    payPeriod?: Relation<PayPeriod>;

    @Column({ type: 'bigint' })
    payPeriodId: string;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: CalcMethod, enumName: 'CalcMethod' })
    calcMethod: CalcMethod;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    factSum: number;

    @AfterLoad()
    transform() {
        this.factSum = Number(this.factSum);
    }
}
