import { IPositionBalance } from '@repo/shared';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Position } from './position.entity';

@Entity()
export class PositionBalance implements IPositionBalance {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Position, (position) => position.balance)
    @JoinColumn()
    position?: Position;

    @Column({ type: 'integer' })
    positionId: number;

    @Column({ type: 'date' })
    payPeriod: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    inBalance?: number;

    @Column({ type: 'integer', default: 0 })
    planDays: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    planHours: number;

    @Column({ type: 'integer', default: 0 })
    factDays: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    factHours: number;

    // See enum PaymentParts
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    accruals: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    deductions: number;

    // See enum PaymentGroups
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    basic: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    adjustments: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    bonuses: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    vacations: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    sicks: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    refunds: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    other_accruals: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    taxes: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    payments: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    other_deductions: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    outBalance: number;

    @AfterLoad()
    transform() {
        this.payPeriod = new Date(this.payPeriod);
        this.inBalance = Number(this.inBalance);
        this.accruals = Number(this.accruals);
        this.deductions = Number(this.deductions);
        this.basic = Number(this.basic);
        this.adjustments = Number(this.adjustments);
        this.bonuses = Number(this.bonuses);
        this.vacations = Number(this.vacations);
        this.sicks = Number(this.sicks);
        this.refunds = Number(this.refunds);
        this.other_accruals = Number(this.other_accruals);
        this.taxes = Number(this.taxes);
        this.payments = Number(this.payments);
        this.other_deductions = Number(this.other_deductions);
        this.outBalance = Number(this.outBalance);
    }
}
