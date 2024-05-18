import { ICompany, PaymentSchedule } from '@repo/shared';
import { endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserCompany } from '../../../resources/users/entities/user-company.entity';
import { Logger } from '../../abstract/logger.abstract';
import { Accounting } from '../../accounting/entities/accounting.entity';
import { Department } from '../../departments/entities/department.entity';
import { Law } from '../../laws/entities/law.entity';
import { Position } from '../../positions/entities/position.entity';

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

    @OneToMany(() => Position, (position) => position.company)
    positions?: Position[];

    @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
    users?: UserCompany[];

    @BeforeInsert()
    beforeInsert() {
        normalize(this);
    }
    @BeforeUpdate()
    beforeUpdate() {
        normalize(this);
    }

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
        this.payPeriod = new Date(this.payPeriod);
        this.checkDate = new Date(this.checkDate);
    }
}

function normalize(record: ICompany) {
    record.payPeriod = startOfMonth(record?.payPeriod || new Date());
    record.checkDate = startOfDay(endOfMonth(record?.payPeriod || new Date()));
}
