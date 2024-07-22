import {
    AfterLoad,
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { Company } from './../../companies/entities/company.entity';
import { Logger } from './../../abstract/logger.abstract';

@Entity()
export class Department extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @ManyToOne(() => Company, (company) => company.departments)
    company?: Relation<Company>;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @ManyToOne(() => Department, (department) => department.childDepartments, { nullable: true })
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
