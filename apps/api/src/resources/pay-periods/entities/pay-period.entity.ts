import { PayPeriodPaymentGroup } from './pay-period-payment-group.entity';
import { IPayPeriod, PayPeriodState } from '@repo/shared';
import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Logger } from '../../abstract/logger.abstract';
import { Company } from '../../companies/entities/company.entity';

export const defaultFieldList = {
    select: {
        id: true,
        companyId: true,
        dateFrom: true,
        dateTo: true,
    },
};

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
    inCompanyDebt?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    inEmployeeDebt?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    outBalance?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    outCompanyDebt?: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    outEmployeeDebt?: number;

    @OneToMany(
        () => PayPeriodPaymentGroup,
        (payPeriodPaymentGroup) => payPeriodPaymentGroup.payPeriod,
    )
    paymentGroups?: PayPeriodPaymentGroup[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
        this.inBalance = Number(this.inBalance);
        this.inCompanyDebt = Number(this.inCompanyDebt);
        this.inEmployeeDebt = Number(this.inEmployeeDebt);
        this.outBalance = Number(this.outBalance);
        this.outCompanyDebt = Number(this.outCompanyDebt);
        this.outEmployeeDebt = Number(this.outEmployeeDebt);
    }
}
