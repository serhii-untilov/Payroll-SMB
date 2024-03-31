import { ICompany, PaymentSchedule } from '@repo/shared';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Logger } from '../../abstract/logger.abstract';
import { Accounting } from '../../accounting/entities/accounting.entity';
import { Department } from '../../departments/entities/department.entity';
import { Law } from '../../laws/entities/law.entity';
import { endOfMonth, startOfDay, startOfMonth } from 'date-fns';

@Entity()
export class Company extends Logger implements ICompany {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15, default: '' })
    taxId?: string;

    @ManyToOne(() => Law, {
        createForeignKeyConstraints: false,
    })
    law?: Law;

    @Column({ type: 'integer', nullable: true })
    lawId: number;

    @ManyToOne(() => Accounting, {
        createForeignKeyConstraints: false,
    })
    accounting?: Accounting;

    @Column({ type: 'integer', nullable: true })
    accountingId: number;

    @Column({ type: 'varchar', length: 10, default: PaymentSchedule.LAST_DAY })
    paymentSchedule: string;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom?: Date | null;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo?: Date | null;

    @Column({ type: 'date' })
    payPeriod: Date;

    @Column({ type: 'date' })
    checkDate: Date;

    @OneToMany(() => Department, (department) => department.company)
    departments?: Department[];

    @BeforeInsert()
    beforeInsert() {
        normalize(this);
    }
    @BeforeUpdate()
    beforeUpdate() {
        normalize(this);
    }
}

function normalize(record: ICompany) {
    record.payPeriod = startOfMonth(record?.payPeriod || new Date());
    record.checkDate = startOfDay(endOfMonth(record?.payPeriod || new Date()));
}
