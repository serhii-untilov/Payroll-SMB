import { IPayment } from '@repo/shared';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from './../../../resources/abstract/logger.abstract';
import { Company } from './../../../resources/companies/entities/company.entity';
import { PaymentType } from './../../../resources/payment-types/entities/payment-type.entity';

@Entity()
export class Payment extends Logger implements IPayment {
    @PrimaryGeneratedColumn('increment')
    id: number;
    @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    company?: Company;
    @Column({ type: 'integer' })
    companyId: number;
    @Column({ type: 'date' })
    payPeriod: Date;
    @Column({ type: 'date' })
    accPeriod: Date;
    @Column({ type: 'varchar', length: 10 })
    docNumber: string;
    @Column({ type: 'date' })
    docDate: Date;
    @ManyToOne(() => PaymentType, { createForeignKeyConstraints: false })
    paymentType?: PaymentType;
    @Column({ type: 'integer' })
    paymentTypeId: number;
    @Column({ type: 'date' })
    dateFrom: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    @Column({ type: 'date' })
    dateTo: Date; // Between accPeriod.dateFrom and accPeriod.dateTo
    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    grossPay?: number;
    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    deductions?: number;
    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    netPay?: number;
    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    funds?: number;
    @Column({ type: 'varchar', length: 10 })
    status: string; // See enum PaymentStatus
    @Column({ type: 'bigint', default: 0 })
    recordFlags?: number; // See enum RecordFlags
    @Column({ type: 'varchar', length: 256 })
    description?: string;

    @AfterLoad()
    transform() {
        this.payPeriod = new Date(this.payPeriod);
        this.accPeriod = new Date(this.accPeriod);
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
        if (this.grossPay) this.grossPay = Number(this.grossPay);
        if (this.deductions) this.deductions = Number(this.deductions);
        if (this.netPay) this.netPay = Number(this.netPay);
        if (this.funds) this.funds = Number(this.funds);
    }
}
