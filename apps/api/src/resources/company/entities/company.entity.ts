import { BaseEntity } from '@/resources/common/base';
import { ApiProperty } from '@nestjs/swagger';
import { monthBegin, monthEnd } from '@repo/shared';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { PaymentSchedule } from '../../../types/lib/payment-schedule';
import { UserRole } from '../../user-role/entities/user-role.entity';
import { Accounting } from '../../accounting/entities/accounting.entity';
import { Department } from '../../departments/entities/department.entity';
import { Law } from '../../laws/entities/law.entity';
import { Position } from '../../positions/entities/position.entity';

@Entity()
export class CompanyEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15, default: '', nullable: true })
    taxId: string;

    @ManyToOne(() => Law, {
        createForeignKeyConstraints: false,
    })
    law?: Relation<Law>;

    @Column({ type: 'bigint', nullable: true })
    lawId: string;

    @ManyToOne(() => Accounting, {
        createForeignKeyConstraints: false,
    })
    accounting?: Relation<Accounting>;

    @Column({ type: 'bigint', nullable: true })
    accountingId: string;

    @Column({ type: 'varchar', length: 10, default: PaymentSchedule.LastDay })
    @ApiProperty({ enum: PaymentSchedule, enumName: 'PaymentSchedule' })
    paymentSchedule: PaymentSchedule;

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

    @OneToMany(() => UserRole, (userCompany) => userCompany.company)
    users?: Relation<UserRole>[];

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

function normalize(record: CompanyEntity) {
    record.payPeriod = monthBegin(record.payPeriod || new Date());
    record.checkDate = monthEnd(record.payPeriod || new Date());
}
