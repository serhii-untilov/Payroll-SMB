import { AfterLoad, Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { Company } from './../../companies/entities/company.entity';

@Entity()
export class Department extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => Company, (company) => company.departments)
    company?: Relation<Company>;

    @Column({ type: 'bigint' })
    companyId: string;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @ManyToOne(() => Department, (department) => department.childDepartments, { nullable: true })
    parentDepartment?: Relation<Department> | null;

    @Column({ type: 'bigint', nullable: true })
    parentDepartmentId?: string | null;

    @OneToMany(() => Department, (department) => department.parentDepartment)
    childDepartments?: Relation<Department>[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
