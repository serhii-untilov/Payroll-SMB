import { WorkNormType } from './../../../types';
import { Column, PrimaryGeneratedColumn, OneToMany, Entity, AfterLoad, Relation } from 'typeorm';
import { WorkNormPeriod } from './work-norm-period.entity';
import { Logger } from './../../abstract/logger.abstract';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class WorkNorm extends Logger {
    @PrimaryGeneratedColumn('increment')
    id: number;

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
