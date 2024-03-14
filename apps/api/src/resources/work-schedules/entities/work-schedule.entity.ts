import { IWorkSchedule } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { Column, PrimaryGeneratedColumn, OneToMany, Entity } from 'typeorm';
import { WorkSchedulePeriod } from './work-schedule-period.entity';

@Entity()
export class WorkSchedule extends Logger implements IWorkSchedule {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    type: string;

    @Column({ type: 'date', default: '1970-01-01' })
    dateFrom?: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo?: Date;

    @OneToMany(() => WorkSchedulePeriod, (workSchedulePeriod) => workSchedulePeriod.workSchedule)
    periods?: WorkSchedulePeriod[];
}
