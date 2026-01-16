import { AfterLoad, Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { CompanyEntity } from '../../company/entities/company.entity';

@Entity()
export class DepartmentEntity extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => CompanyEntity, (company) => company.departments)
    company?: Relation<CompanyEntity>;

    @Column({ type: 'bigint' })
    companyId: string;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @ManyToOne(() => DepartmentEntity, (department) => department.childDepartments, { nullable: true })
    parentDepartment?: Relation<DepartmentEntity> | null;

    @Column({ type: 'bigint', nullable: true })
    parentDepartmentId?: string | null;

    @OneToMany(() => DepartmentEntity, (department) => department.parentDepartment)
    childDepartments?: Relation<DepartmentEntity>[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
