import { IPosition } from '@repo/shared';
import {
    AfterInsert,
    AfterLoad,
    AfterUpdate,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Logger } from '../../abstract/logger.abstract';
import { Company } from '../../companies/entities/company.entity';
import { Person } from '../../persons/entities/person.entity';
import { PositionHistory } from '../../position-history/entities/position-history.entity';

@Entity()
export class Position extends Logger implements IPosition {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Company, (company) => company.positions)
    // @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    @JoinColumn()
    company?: Company;

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
    person?: Person;

    @Column({ type: 'integer', nullable: true })
    personId?: number | null; // Vacancy, if not defined

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom?: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo?: Date;

    @OneToMany(() => PositionHistory, (history) => history.position)
    history?: PositionHistory[];

    name: string;

    @AfterLoad()
    @AfterInsert()
    @AfterUpdate()
    generateName(): void {
        this.name = this.person?.id ? this.person.fullName : 'Vacancy';
    }
}
