import { IWorkNorm } from '@repo/shared';
import { Logger } from '../../abstract/logger.abstract';
import { Column, PrimaryGeneratedColumn, OneToMany, Entity } from 'typeorm';
import { WorkNormPeriod } from './work-schedule-period.entity';

@Entity()
export class WorkNorm extends Logger implements IWorkNorm {
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

    @OneToMany(() => WorkNormPeriod, (workNormPeriod) => workNormPeriod.workNorm)
    periods?: WorkNormPeriod[];
}
