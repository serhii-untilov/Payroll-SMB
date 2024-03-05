import { IDepartment } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { Column, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';

export class Department extends Logger implements IDepartment {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => Company, (company) => company.departments)
    @JoinColumn()
    company?: Company;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'date', default: '1970-01-01' })
    dateFrom?: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo?: Date;

    @ManyToOne(() => Department, (department) => department.childDepartments, { nullable: true })
    @JoinColumn()
    parentDepartment?: Department | null;

    @Column({ type: 'integer', nullable: true })
    parentDepartmentId?: number | null;

    @OneToMany(() => Department, (department) => department.parentDepartment)
    childDepartments?: Department[];
}
