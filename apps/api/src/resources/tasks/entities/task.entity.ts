import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { TaskStatus, TaskType } from './../../../types';
import { Company } from './../../companies/entities/company.entity';

@Entity()
export class Task extends BaseEntity {
    @ManyToOne(() => Company, { createForeignKeyConstraints: false })
    company?: Relation<Company>;

    @Column({ type: 'bigint' })
    companyId: string;

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

    @Column({ type: 'bigint', nullable: true })
    entityId: string | null;

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
