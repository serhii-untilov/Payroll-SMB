import {
    AfterLoad,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { Logger } from './../../abstract/logger.abstract';
import { Company } from './../../../resources/companies/entities/company.entity';

@Entity()
export class Department extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => Company, (company) => company.departments)
    @JoinColumn()
    company?: Relation<Company>;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @ManyToOne(() => Department, (department) => department.childDepartments, { nullable: true })
    @JoinColumn()
    parentDepartment?: Relation<Department> | null;

    @Column({ type: 'integer', nullable: true })
    parentDepartmentId?: number | null;

    @OneToMany(() => Department, (department) => department.parentDepartment)
    childDepartments?: Relation<Department>[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
