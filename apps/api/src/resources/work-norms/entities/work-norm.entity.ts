import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../abstract/base-entity.abstract';
import { WorkNormType } from './../../../types';
import { WorkNormPeriod } from './work-norm-period.entity';

@Entity()
export class WorkNorm extends BaseEntity {
    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30, default: WorkNormType.Weekly })
    @ApiProperty({ enum: WorkNormType, enumName: 'WorkNormType' })
    type: WorkNormType;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @OneToMany(() => WorkNormPeriod, (workNormPeriod) => workNormPeriod.workNorm, {
        cascade: true,
    })
    periods?: Relation<WorkNormPeriod>[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
