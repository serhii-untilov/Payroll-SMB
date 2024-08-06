import { Logger } from '../../abstract';
import { Company } from '../../companies/entities/company.entity';
import { PayPeriodState } from './../../../types';
import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { PayPeriodCalcMethod } from './pay-period-calc-method.entity';

export const defaultFieldList = {
    select: {
        id: true,
        companyId: true,
        dateFrom: true,
        dateTo: true,
    },
};

@Entity()
export class PayPeriod extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Company, (company) => company.departments)
    @JoinColumn()
    company?: Relation<Company>;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;
    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'varchar', length: 10, default: PayPeriodState.Opened })
    state: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    inBalance: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    inCompanyDebt: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    inEmployeeDebt: number;

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
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    outCompanyDebt: number;
    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    outEmployeeDebt: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    funds: number;

    @OneToMany(() => PayPeriodCalcMethod, (payPeriodCalcMethod) => payPeriodCalcMethod.payPeriod)
    calcMethods?: Relation<PayPeriodCalcMethod>[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
        this.inBalance = Number(this.inBalance);
        this.inCompanyDebt = Number(this.inCompanyDebt);
        this.inEmployeeDebt = Number(this.inEmployeeDebt);
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
        this.outCompanyDebt = Number(this.outCompanyDebt);
        this.outEmployeeDebt = Number(this.outEmployeeDebt);
        this.funds = Number(this.funds);
    }
}
