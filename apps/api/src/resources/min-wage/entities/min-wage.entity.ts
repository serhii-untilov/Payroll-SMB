import { Logger } from './../../../resources/abstract/logger.abstract';
import { IMinWage } from '@repo/shared';
import { AfterLoad, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@Index('MIN_WAGE_DATE_FROM_INDEX', ['dateFrom', 'dateTo', 'paySum'], { unique: true })
export class MinWage extends Logger implements IMinWage {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'date', default: '1900-01-01' })
    dateFrom: Date;

    @Column({ type: 'date', default: '9999-12-31' })
    dateTo: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    paySum: number;

    @AfterLoad()
    transform() {
        this.dateFrom = new Date(this.dateFrom);
        this.dateTo = new Date(this.dateTo);
        this.paySum = Number(this.paySum);
    }
}
