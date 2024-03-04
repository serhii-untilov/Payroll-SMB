import { IDepartment } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export class Department extends Logger implements IDepartment {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Company, {
        createForeignKeyConstraints: false,
    })
    company?: Company;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'date', default: '1970-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;
}
