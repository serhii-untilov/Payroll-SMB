import { ICompany } from '@repo/shared';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Logger } from '../../abstract/logger.abstract';
import { Accounting } from '../../accounting/entities/accounting.entity';
import { User } from '../../users/entities/user.entity';
import { Law } from '../../laws/entities/law.entity';

@Entity()
export class Company extends Logger implements ICompany {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 15 })
    taxId: string;

    @ManyToOne(() => Law, (law) => law.companies)
    law: Law;

    @ManyToOne(() => Accounting, (accounting) => accounting.companies)
    accounting: Accounting;

    @ManyToOne(() => User, (user) => user.companies)
    owner: User;

    @Column({ type: 'date', default: '1970-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'date', default: '1970-01-01' })
    payPeriod: Date;

    @Column({ type: 'date', default: '1970-01-01' })
    checkDate: Date;
}
