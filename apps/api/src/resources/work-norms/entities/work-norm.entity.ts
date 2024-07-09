import { IWorkNorm, WorkNormType } from '@repo/shared';
import { Column, PrimaryGeneratedColumn, OneToMany, Entity, AfterLoad } from 'typeorm';
import { WorkNormPeriod } from './work-norm-period.entity';
import { Logger } from '@/resources/abstract/logger.abstract';

@Entity()
export class WorkNorm extends Logger implements IWorkNorm {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'varchar', length: 30, default: WorkNormType.WEEKLY })
    type: string;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @OneToMany(() => WorkNormPeriod, (workNormPeriod) => workNormPeriod.workNorm, {
        cascade: true,
    })
    periods?: WorkNormPeriod[];

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
    }
}
