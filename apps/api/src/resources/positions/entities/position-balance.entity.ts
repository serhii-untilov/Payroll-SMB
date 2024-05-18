import { IPositionBalance } from '@repo/shared';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Position } from './position.entity';

@Entity()
export class PositionBalance implements IPositionBalance {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Position, (position) => position.balance)
    // @ManyToOne(() => Position, { createForeignKeyConstraints: false })
    @JoinColumn()
    position?: Position;

    @Column({ type: 'integer' })
    positionId: number;

    @Column({ type: 'date' })
    payPeriod: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    inBalance?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    accrualsSum?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    deductionsSum?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    outBalance?: number;

    @AfterLoad()
    transform() {
        this.payPeriod = new Date(this.payPeriod);
        this.inBalance = Number(this.inBalance);
        this.accrualsSum = Number(this.accrualsSum);
        this.deductionsSum = Number(this.deductionsSum);
        this.outBalance = Number(this.outBalance);
    }
}
