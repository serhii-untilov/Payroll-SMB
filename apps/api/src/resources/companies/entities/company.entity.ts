import { ICompany } from '@repo/shared';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from '../../abstract/logger.abstract';
import { Accounting } from '../../accounting/entities/accounting.entity';
import { User } from '../../users/entities/user.entity';
import { Law } from '../../laws/entities/law.entity';
// import { Department } from '../../departments/entities/department.entity';

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

    // @OneToMany(() => Department, {
    //     createForeignKeyConstraints: false,
    // })
    // departments?: Department[];

    @ManyToOne(() => User, (user) => user.companies)
    owner?: User;

    @Column({ type: 'integer', nullable: true })
    ownerId: number;

    @Column({ type: 'date', default: '1970-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'date', default: '1970-01-01' })
    payPeriod: Date;

    @Column({ type: 'date', default: '1970-01-01' })
    checkDate: Date;
}
