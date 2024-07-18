import { Logger } from './../../abstract/logger.abstract';
import { Accounting } from './../../../resources/accounting/entities/accounting.entity';
import { Department } from './../../../resources/departments/entities/department.entity';
import { Law } from './../../../resources/laws/entities/law.entity';
import { Position } from './../../../resources/positions/entities/position.entity';
import { UserCompany } from './../../../resources/users/entities/user-company.entity';
import { PaymentSchedule, monthBegin, monthEnd } from '@/types';
import {
    AfterLoad,
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';

@Entity()
export class Company extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15, default: '' })
    taxId: string;

    @ManyToOne(() => Law, {
        createForeignKeyConstraints: false,
    })
    law?: Relation<Law>;

    @Column({ type: 'integer', nullable: true })
    lawId: number;

    @ManyToOne(() => Accounting, {
        createForeignKeyConstraints: false,
    })
    accounting?: Relation<Accounting>;

    @Column({ type: 'integer', nullable: true })
    accountingId: number;

    @Column({ type: 'varchar', length: 10, default: PaymentSchedule.LAST_DAY })
    paymentSchedule: string;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'date' })
    payPeriod: Date;

    @Column({ type: 'date' })
    checkDate: Date;

    @OneToMany(() => Department, (department) => department.company)
    departments?: Relation<Department>[];

    @OneToMany(() => Position, (position) => position.company)
    positions?: Relation<Position>[];

    @OneToMany(() => UserCompany, (userCompany) => userCompany.company)
    users?: Relation<UserCompany>[];

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

function normalize(record: Company) {
    record.payPeriod = monthBegin(record.payPeriod || new Date());
    record.checkDate = monthEnd(record.payPeriod || new Date());
}
