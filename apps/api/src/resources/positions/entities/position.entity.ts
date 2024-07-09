import { Logger } from './../../../resources/abstract/logger.abstract';
import { Company } from './../../../resources/companies/entities/company.entity';
import { Person } from './../../../resources/persons/entities/person.entity';
import { PositionHistory } from './../../../resources/position-history/entities/position-history.entity';
import { IPosition } from '@repo/shared';
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
import { PositionBalance } from './position-balance.entity';

@Entity()
export class Position extends Logger implements IPosition {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Company, (company) => company.positions)
    // @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    @JoinColumn()
    company?: Relation<Company>;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'varchar', length: 15 })
    cardNumber: string; // Табельний номер

    @Column({ type: 'integer', default: 2147483647 })
    sequenceNumber: number; // Sequence in payroll reports to place managers on top

    @Column({ type: 'varchar', length: 260, default: '' })
    description: string;

    @ManyToOne(() => Person, (person) => person.positions)
    @JoinColumn()
    person?: Relation<Person>;

    @Column({ type: 'integer', nullable: true })
    personId: number | null; // Vacancy, if not defined

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @OneToMany(() => PositionHistory, (history) => history.position)
    history?: Relation<PositionHistory>[];

    @OneToMany(() => PositionBalance, (balance) => balance.position)
    balance?: Relation<PositionBalance>[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
