import { BaseEntity } from '@/resources/common/base';
import { PaymentSchedule } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { monthBegin, monthEnd } from '@repo/shared';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { Accounting } from '../../accounting/entities/accounting.entity';
import { DepartmentEntity } from '../../department/entities/department.entity';
import { Law } from '../../laws/entities/law.entity';
import { Position } from '../../positions/entities/position.entity';
import { UserRole } from '../../user-role/entities/user-role.entity';

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
    lawId: string | null;

    @ManyToOne(() => Accounting, {
        createForeignKeyConstraints: false,
    })
    accounting?: Relation<Accounting>;

    @Column({ type: 'bigint', nullable: true })
    accountingId: string | null;

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

    @OneToMany(() => DepartmentEntity, (department) => department.company)
    departments?: Relation<DepartmentEntity>[];

    @OneToMany(() => Position, (position) => position.company)
    positions?: Relation<Position>[];

    @OneToMany(() => UserRole, (userCompany) => userCompany.company)
    users?: Relation<UserRole>[];

    @BeforeInsert()
    @BeforeUpdate()
    normalizePeriods() {
        normalize(this);
    }

    @AfterLoad()
    normalizeDates() {
        if (this.dateFrom) this.dateFrom = new Date(this.dateFrom);
        if (this.dateTo) this.dateTo = new Date(this.dateTo);
        if (this.payPeriod) this.payPeriod = new Date(this.payPeriod);
        if (this.checkDate) this.checkDate = new Date(this.checkDate);
    }
}

function normalize(record: CompanyEntity) {
    const baseDate = record.payPeriod ?? new Date();
    const normalizedPayPeriod = monthBegin(baseDate);

    record.payPeriod = normalizedPayPeriod;
    record.checkDate = monthEnd(normalizedPayPeriod);
}
