import { WorkTimeNormType } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import { AfterLoad, Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/base/base-entity.abstract';
import { WorkTimeNormDay } from './work-time-norm-day.entity';

/**
 * https://github.com/serhii-untilov/Payroll-SMB/wiki/work-time-norm
 */
@Entity()
export class WorkTimeNorm extends BaseEntity {
    @Column({ type: 'varchar', length: 10, nullable: true })
    code: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 250, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 10, default: WorkTimeNormType.Day })
    @ApiProperty({ enum: WorkTimeNormType, enumName: 'WorkTimeNormType' })
    type: WorkTimeNormType;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'boolean', default: true })
    applyHolidays: boolean;

    @Column({ type: 'boolean', default: true })
    applyShortenedDays: boolean;

    @Column({ type: 'boolean', default: true })
    applyMovedDays: boolean;

    @Column({ type: 'boolean', default: false })
    applyPhases: boolean;

    @Column({ type: 'boolean', default: false })
    applyRate: boolean;

    @OneToMany(() => WorkTimeNormDay, (workTimeNormDay) => workTimeNormDay.workTimeNorm, {
        cascade: true,
    })
    days?: Relation<WorkTimeNormDay>[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
