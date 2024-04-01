import { IPosition } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Person } from '../../persons/entities/person.entity';
import { PositionHistory } from '../../position-history/entities/position-history.entity';

@Entity()
export class Position extends Logger implements IPosition {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 30 })
    firstName: string;

    @ManyToOne(() => Company, (company) => company.departments)
    // @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    @JoinColumn()
    company?: Company;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'varchar', length: 15 })
    idNumber: string; // Identity number (Табельний номер)

    @Column({ type: 'integer' })
    sequenceNumber: number; // Sequence in payroll reports to place managers on top

    @Column({ type: 'varchar', length: 260 })
    description: string;

    @ManyToOne(() => Person, (person) => person.positions)
    @JoinColumn()
    person?: Person;

    @Column({ type: 'integer', nullable: true })
    personId?: number | null; // Vacancy if not defined

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom?: Date | null;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo?: Date | null;

    @OneToMany(() => PositionHistory, (history) => history.position)
    history?: PositionHistory[];
}
