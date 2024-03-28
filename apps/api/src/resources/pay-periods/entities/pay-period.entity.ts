import { IPayPeriod, PayPeriodState } from '@repo/shared';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from '../../abstract/logger.abstract';
import { Company } from '../../companies/entities/company.entity';

@Entity()
export class PayPeriod extends Logger implements IPayPeriod {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Company, (company) => company.departments)
    // @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    @JoinColumn()
    company?: Company;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'varchar', length: 10, default: PayPeriodState.OPENED })
    state: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    inBalance?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    accrual?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    deduction?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    tax?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    netPay?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    payment?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    outBalance?: number;
}
