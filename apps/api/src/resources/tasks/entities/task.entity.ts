import { Company } from './../../companies/entities/company.entity';
import { Logger } from './../../abstract/logger.abstract';
import { AfterLoad, Column, Entity, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { TaskStatus, TaskType } from './../../../types';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    company?: Relation<Company>;

    @Column({ type: 'integer' })
    companyId: number;

    @Column({ type: 'varchar', length: 30 })
    @ApiProperty({ enum: TaskType, enumName: 'TaskType' })
    type: TaskType;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'integer' })
    sequenceNumber: number;

    @Column({ type: 'varchar', length: 15 })
    @ApiProperty({ enum: TaskStatus, enumName: 'TaskStatus' })
    status: TaskStatus;

    @Column({ type: 'integer', nullable: true })
    entityId: number | null;

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
