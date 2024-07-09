import { ITask } from '@repo/shared';
import { Logger } from './../../../resources/abstract/logger.abstract';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './../../../resources/companies/entities/company.entity';

@Entity()
export class Task extends Logger implements ITask {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    company?: Company;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'varchar', length: 30 })
    type: string; // See enum TaskType

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'integer' })
    sequenceNumber: number;

    @Column({ type: 'varchar', length: 15 })
    status: string; // See enum TaskStatus

    @Column({ type: 'integer', nullable: true })
    entityId: number | null;

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
